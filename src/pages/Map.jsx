import Map, { Marker } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import Navbar from '../components/Navbar';
import { useState, useRef } from 'react';
import MapSidebar from '../components/MapSidebar';


function TravelMap() {

    
    //keeps track of whether the sidebar is open or closed. 
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [addingPin, setAddingPin] = useState(false);
    const [newPin, setNewPin] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);
    const [pinName, setPinName] = useState('');
    const [selectedMaps, setSelectedMaps] = useState([]);
    const [expandedPinMaps, setExpandedPinMaps] = useState([]);
    const [pins, setPins] = useState([]);

    /*
    Stores the maps that the user has available.
    "visible" determines whether that map's locations should appear.
    "isDefault" identifies built-in maps such as "All Places" which cannot be renamed or deleted.
    */
    const [maps, setMaps] = useState([
        {
            id: 1,
            name: 'All Places',
            visible: false,
            isDefault: true,
            color: '#3388ff',
            submaps: [],
        },
        {
            id: 2,
            name: 'My places',
            visible: false,
            isDefault: false,
            color: '#3388ff',
            submaps: [],
        },
        {
            id: 3,
            name: 'Places to visit',
            visible: false,
            isDefault: false,
            color: '#3388ff',
            submaps: [ 
                { id: 4, name: 'Asia', visible: false, color: '#e74c3c' }, 
                { id: 5, name: 'Europe', visible: false, color: '#3498db' }, 
                { id: 6, name: 'North America', visible: false, color: '#2ecc71' } 
            ],
        }
    ]);

    const togglePinMap = (id) => {
        setSelectedMaps(prev => {
            const selected = new Set(prev);

            // All Places selects or deselects everything
            if (id === 1) {
                const allIds = maps.flatMap(map => [
                    map.id,
                    ...map.submaps.map(submap => submap.id)
                ]);

                const everythingSelected = allIds.every(
                    mapId => selected.has(mapId)
                );

                return everythingSelected ? [] : allIds;
            }

            const selectedMap = maps.find(map => map.id === id);

            if (!selectedMap) {
                return [...selected];
            }

            // If this map has submaps, select/deselect
            // the parent and all of its children
            if (selectedMap.submaps.length > 0) {
                const ids = [
                    selectedMap.id,
                    ...selectedMap.submaps.map(submap => submap.id)
                ];

                const parentSelected = selected.has(id);

                if (parentSelected) {
                    ids.forEach(mapId => selected.delete(mapId));
                } else {
                    ids.forEach(mapId => selected.add(mapId));
                }
            } else {
                // Regular map
                if (selected.has(id)) {
                    selected.delete(id);
                } else {
                    selected.add(id);
                }
            }

            // Check whether every map and submap is selected
            const allIds = maps
                .filter(map => map.id !== 1)
                .flatMap(map => [
                    map.id,
                    ...map.submaps.map(submap => submap.id)
                ]);

            const everythingSelected = allIds.every(
                mapId => selected.has(mapId)
            );

            // All Places should be checked whenever
            // everything else is checked
            if (everythingSelected) {
                selected.add(1);
            } else {
                selected.delete(1);
            }

            return [...selected];
        });
    };

    const togglePinMapExpand = (id) => {
        setExpandedPinMaps(prev =>
            prev.includes(id)
                ? prev.filter(mapId => mapId !== id)
                : [...prev, id]
        );
    };

    const togglePinSubmap = (mapId, submapId) => {
        setSelectedMaps(prev => {
            const selected = new Set(prev);

            // Toggle the clicked submap
            if (selected.has(submapId)) {
                selected.delete(submapId);
            } else {
                selected.add(submapId);
            }

            const parentMap = maps.find(map => map.id === mapId);

            if (!parentMap) {
                return [...selected];
            }

            // Check whether all of this parent's submaps are selected
            const allSubmapsSelected = parentMap.submaps.every(
                submap => selected.has(submap.id)
            );

            // Select or deselect the parent based on its children
            if (allSubmapsSelected) {
                selected.add(mapId);
            } else {
                selected.delete(mapId);
            }

            // Check whether everything is selected
            const allIds = maps
                .filter(map => map.id !== 1)
                .flatMap(map => [
                    map.id,
                    ...map.submaps.map(submap => submap.id)
                ]);

            const everythingSelected = allIds.every(
                id => selected.has(id)
            );

            // If everything is selected, also select All Places
            if (everythingSelected) {
                selected.add(1);
            } else {
                selected.delete(1);
            }

            return [...selected];
        });
    };

    return (
        <>
            <Navbar />

            <div className="map-page">

                {/* Sidebar component that allows users to toggle visibility of maps and rename them. */}
                <MapSidebar 
                    isOpen={sidebarOpen} 
                    setIsOpen={setSidebarOpen} 
                    maps={maps}
                    setMaps={setMaps}
                />

                <div className="map-wrapper">
                    {addingPin && (
                        <div className="pin-search">
                            <input
                                type="text"
                                placeholder="Search for a place..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                            <button
                                onClick={async () => {
                                if (!searchQuery.trim()) return;

                                const response = await fetch(
                                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
                                );

                                const results = await response.json();

                                setSearchResults(results);
                            }}
                            >
                                Search
                            </button>

                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.slice(0, 5).map((result) => (
                                        <button
                                            key={result.place_id}
                                            onClick={() => {
                                                const south = parseFloat(result.boundingbox[0]);
                                                const north = parseFloat(result.boundingbox[1]);
                                                const west = parseFloat(result.boundingbox[2]);
                                                const east = parseFloat(result.boundingbox[3]);

                                                const latitudeSpan = Math.abs(north - south);
                                                const longitudeSpan = Math.abs(east - west);

                                                const largestSpan = Math.max(latitudeSpan, longitudeSpan);

                                                let zoomLevel;

                                                if (largestSpan > 30) {
                                                    zoomLevel = 3;
                                                } else if (largestSpan > 10) {
                                                    zoomLevel = 5;
                                                } else if (largestSpan > 3) {
                                                    zoomLevel = 7;
                                                } else if (largestSpan > 1) {
                                                    zoomLevel = 9;
                                                } else if (largestSpan > 0.2) {
                                                    zoomLevel = 12;
                                                } else if (largestSpan > 0.05) {
                                                    zoomLevel = 14;
                                                } else {
                                                    zoomLevel = 17;
                                                }

                                                mapRef.current?.flyTo({
                                                    center: [
                                                        parseFloat(result.lon),
                                                        parseFloat(result.lat)
                                                    ],
                                                    zoom: zoomLevel,
                                                    duration: 1500
                                                });

                                                setSearchResults([]);
                                            }}
                                        >
                                            {result.display_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Main map component that displays the map using MapLibre GL. */}
                    <Map ref={mapRef} className="map-container"
                        initialViewState={{
                            longitude: -30,
                            latitude: 30,
                            zoom: 2,
                        }}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        mapStyle="https://tiles.openfreemap.org/styles/positron"
                        onClick={(event) => {
                            if (!addingPin) return;
                            setNewPin({
                                longitude: event.lngLat.lng,
                                latitude: event.lngLat.lat
                            });
                            setAddingPin(false);
                            setPinName('');
                            setSelectedMaps([]);
                        }}
                    >
                        {newPin && (
                            <Marker
                                longitude={newPin.longitude}
                                latitude={newPin.latitude}
                            />
                        )}
                        {pins.map(pin => (
                            <Marker
                                key={pin.id}
                                longitude={pin.longitude}
                                latitude={pin.latitude}
                            />
                        ))}
                    </Map>

                    {newPin && (
                        <div className="pin-details-overlay">
                            <div className="pin-details-popup">
                                <h3>Add Pin</h3>

                                <input
                                    type="text"
                                    placeholder="Enter place name"
                                    value={pinName}
                                    onChange={(event) => setPinName(event.target.value)}
                                />

                                <h4>Choose Maps</h4>

                                <div className="pin-map-list">
                                    {maps.map((map) => (
                                        <div key={map.id}>

                                            {/* Parent map */}
                                            <div className="pin-map-item">

                                                <div className="pin-dropdown-container">
                                                    <button
                                                        className={`pin-dropdown-button ${
                                                            map.submaps.length === 0
                                                                ? 'pin-dropdown-button-hidden'
                                                                : ''
                                                        }`}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            togglePinMapExpand(map.id);
                                                        }}
                                                    >
                                                        {expandedPinMaps.includes(map.id) ? '▾' : '▸'}
                                                    </button>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={selectedMaps.includes(map.id)}
                                                    onChange={() => togglePinMap(map.id)}
                                                />

                                                <span
                                                    className="pin-map-name"
                                                    style={{ color: map.color }}
                                                >
                                                    {map.name}
                                                </span>

                                            </div>

                                            {/* Submaps */}
                                            {expandedPinMaps.includes(map.id) && (
                                                <div className="pin-submap-list">
                                                    {map.submaps.map((submap) => (
                                                        <div
                                                            key={submap.id}
                                                            className="pin-submap-item"
                                                        >
                                                            <div className="pin-submap-spacer"></div>

                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMaps.includes(submap.id)}
                                                                onChange={() => togglePinSubmap(
                                                                    map.id,
                                                                    submap.id
                                                                )}
                                                            />

                                                            <span
                                                                className="pin-submap-name"
                                                                style={{ color: submap.color }}
                                                            >
                                                                {submap.name}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>

                                <div className="pin-details-buttons">
                                    <button onClick={() => setNewPin(null)}>
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (pinName.trim() === '') {
                                                alert('Please enter a name for the pin.');
                                                return;
                                            }

                                            if (selectedMaps.length === 0) {
                                                alert('Please select at least one map.');
                                                return;
                                            }

                                            const pin = {
                                                id: Date.now(),
                                                name: pinName.trim(),
                                                longitude: newPin.longitude,
                                                latitude: newPin.latitude,
                                                maps: selectedMaps
                                            };

                                            setPins(prevPins => [...prevPins, pin]);

                                            setNewPin(null);
                                            setPinName('');
                                            setSelectedMaps([]);
                                        }}
                                    >
                                        Save Pin
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        className="add-pin-button" 
                        onClick={() => {
                            setAddingPin(!addingPin)
                            setNewPin(null);
                        }}
                    >
                        {addingPin ? 'Cancel Add Pin' : '+ Add Pin'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default TravelMap;