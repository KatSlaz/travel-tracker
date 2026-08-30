import Map from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import MapSidebar from '../components/MapSidebar';


function TravelMap() {

    
    //keeps track of whether the sidebar is open or closed. 
    const [sidebarOpen, setSidebarOpen] = useState(true);

    /*
    Stores the maps that the user has available.
    "visible" determines whether that map's locations should appear.
    "isDefault" identifies built-in maps such as "All Places" which cannot be renamed or deleted.
    */
    const [maps, setMaps] = useState([
        {
            id: 1,
            name: 'All Places',
            visible: true,
            isDefault: true,
            submaps: [],
        },
        {
            id: 2,
            name: 'My places',
            visible: false,
            isDefault: false,
            submaps: [],
        },
        {
            id: 3,
            name: 'Places to visit',
            visible: false,
            isDefault: false,
            submaps: [ 
                { id: 4, name: 'Asia', visible: true }, 
                { id: 5, name: 'Europe', visible: true }, 
                { id: 6, name: 'North America', visible: true } 
            ],
        }
    ]);

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

                {/* Main map component that displays the map using MapLibre GL. */}
                <Map className="map-container"
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
                />
            </div>
        </>
    );
}

export default TravelMap;