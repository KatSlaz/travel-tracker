import './MapSidebar.css';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

function MapSidebar({ isOpen, setIsOpen, maps, setMaps }) {
    
    // Keeps track of which map is currently being customized with null meaning no map is being customized.
    const [customizingMap, setCustomizingMap] = useState(null);

    //keeps track of which map we are renaming
    const [renamingMap, setRenamingMap] = useState(null);

    const [deletingMap, setDeletingMap] = useState(null);
    const [newMapName, setNewMapName] = useState('');
    const [addingSubmap, setAddingSubmap] = useState(null);
    const [newSubmapName, setNewSubmapName] = useState('');
    const [addingMap, setAddingMap] = useState(false);
    const [expandedMaps, setExpandedMaps] = useState([]);
    const [customizingSubmap, setCustomizingSubmap] = useState(null);
    const [renamingSubmap, setRenamingSubmap] = useState(null);
    const [deletingSubmap, setDeletingSubmap] = useState(null);
    const menuRef = useRef(null);
    const submapMenuRef = useRef(null);
    const [changingColor, setChangingColor] = useState(null);
    const [newColor, setNewColor] = useState('#3388ff');
    
    // Closes the customization menu if the user clicks outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setCustomizingMap(null);
            }
            if (submapMenuRef.current && !submapMenuRef.current.contains(event.target)) {
                setCustomizingSubmap(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggles the visibility of a map by its ID and all its submaps.
    function toggleMap(id) {
        setMaps(prevMaps => {
            // If All Places is being toggled
            if (id === 1) {
                const allPlaces = prevMaps.find(map => map.id === 1);
                const newVisibility = !allPlaces.visible;

                return prevMaps.map(map => ({
                    ...map,
                    visible: newVisibility,
                    submaps: map.submaps.map(submap => ({
                        ...submap,
                        visible: newVisibility
                    }))
                }));
            }

            // Toggle the selected map normally
            const updatedMaps = prevMaps.map(map => {
                if (map.id !== id) {
                    return map;
                }

                if (map.submaps.length > 0) {
                    const newVisibility = !map.visible;

                    return {
                        ...map,
                        visible: newVisibility,
                        submaps: map.submaps.map(submap => ({
                            ...submap,
                            visible: newVisibility
                        }))
                    };
                }

                return {
                    ...map,
                    visible: !map.visible
                };
            });

            // Check if EVERYTHING is now visible
            const everythingVisible = updatedMaps
                .filter(map => map.id !== 1)
                .every(map =>
                    map.visible &&
                    map.submaps.every(submap => submap.visible)
                );

            // Update All Places based on that
            return updatedMaps.map(map =>
                map.id === 1
                    ? { ...map, visible: everythingVisible }
                    : map
            );
        });
    }

    //toggles the visibility of a submap by its ID and updates the parent map visibility.
    function toggleSubmap(mapId, submapId) {
        setMaps(prevMaps => {
            const updatedMaps = prevMaps.map(map => {
                if (map.id !== mapId) {
                    return map;
                }

                const updatedSubmaps = map.submaps.map(submap =>
                    submap.id === submapId
                        ? { ...submap, visible: !submap.visible }
                        : submap
                );

                const allSubmapsVisible = updatedSubmaps.every(
                    submap => submap.visible
                );

                return {
                    ...map,
                    visible: allSubmapsVisible,
                    submaps: updatedSubmaps
                };
            });

            // Check if every map and every submap is visible
            const everythingVisible = updatedMaps
                .filter(map => map.id !== 1)
                .every(map =>
                    map.visible &&
                    map.submaps.every(submap => submap.visible)
                );

            return updatedMaps.map(map =>
                map.id === 1
                    ? { ...map, visible: everythingVisible }
                    : map
            );
        });
    }

    //toggles the expansion of a map by its ID.
    function toggleExpandMap(id) {
        setExpandedMaps(expandedMaps.includes(id) ? expandedMaps.filter(mapId => mapId !== id) : [...expandedMaps, id]);
    }

    return (
        <aside className={`map-sidebar ${isOpen ? 'open' : 'closed'}`}>

            <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
            
            <div className="sidebar-content">
                <header className="sidebar-header">
                    <h2>My Maps</h2>
                </header>

                <div className="map-list">
                    
                    {/* Creates a row for each map in the maps array */}
                    {maps.map((map) => (
                        
                        <div key={map.id} className="map-item-container">
                            
                            <div className="map-item" onClick={() => toggleMap(map.id)}>
                                    <div className="dropdown-container">
                                        <button 
                                            className={`dropdown-button ${
                                                map.submaps.length === 0 ? 'dropdown-button-hidden' : ''
                                            }`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                toggleExpandMap(map.id);
                                            }}
                                        >
                                            {expandedMaps.includes(map.id) ? '▾' : '▸'}
                                        </button>
                                    </div>

                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={map.visible}

                                            //updates the map visibility when checkbox is clicked.
                                            onChange={() => toggleMap(map.id)}

                                            // stops clicking the checkbox from also trigerring the parent div onClick.
                                            onClick={(event) => event.stopPropagation()}
                                        />
                                    </div>

                                    <span className="map-name" style={{ color: map.color }}>{map.name}</span>

                                {!map.isDefault && (
                                    <button 
                                    className="map-menu-button"
                                    onClick={(event) => {
                                        //prevent the button click from also triggering the parent div onClick.
                                        event.stopPropagation();
                                        //toggles customization menu for the map.
                                        setCustomizingMap(customizingMap === map.id ? null : map.id);
                                    }}
                                    >⋮</button>
                                )}
                            </div>

                            {/* displays the submaps of a map if it is expanded. */}
                            {expandedMaps.includes(map.id) && (
                                <div className="submap-list">
                                    {map.submaps.map((submap) => (
                                        <div 
                                            key={submap.id} 
                                            className="submap-item"
                                            onClick={() => toggleSubmap(map.id, submap.id)}>
                                            <input
                                                type="checkbox"
                                                checked={submap.visible}
                                                onChange={() => toggleSubmap(map.id, submap.id)}
                                                onClick={(event) => event.stopPropagation()}
                                            />
                                            <span className="submap-name" style={{ color: submap.color }}>
                                                {submap.name}
                                            </span>
                                            <button
                                                className="submap-menu-button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setCustomizingSubmap(
                                                        customizingSubmap === submap.id ? null : submap.id
                                                    )
                                                }}
                                            >
                                                ⋮
                                            </button>

                                            {customizingSubmap === submap.id && (
                                                <div 
                                                ref={submapMenuRef} 
                                                className="submap-customization-menu"
                                                onClick={(event) => event.stopPropagation()}
                                                >
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setNewSubmapName(submap.name);
                                                            setRenamingSubmap({
                                                                mapId: map.id,
                                                                submapId: submap.id
                                                            })
                                                            setCustomizingSubmap(null);
                                                        }}
                                                    >
                                                        rename
                                                    </button>

                                                    <button 
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setNewColor(submap.color);
                                                            setChangingColor({
                                                                mapId: map.id,
                                                                submapId: submap.id
                                                            });
                                                            setCustomizingMap(null);
                                                        }}
                                                    >
                                                        change color
                                                    </button>

                                                    <button 
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            
                                                            setDeletingSubmap({
                                                                mapId: map.id,
                                                                submapId: submap.id
                                                            })
                                                            setCustomizingSubmap(null);
                                                        }}
                                                    >
                                                        delete
                                                    </button>
                                                </div>
                                        )}
                                        
                                        {renamingSubmap &&
                                renamingSubmap.mapId === map.id &&
                                renamingSubmap.submapId === submap.id && (
                                    <div className="rename-overlay">
                                        <div 
                                        className="rename-popup"
                                        onClick={(event) => event.stopPropagation()}
                                        >
                                            <h3>Rename Submap</h3>

                                            <input 
                                                type="text"
                                                placeholder="Enter new submap name"
                                                value={newSubmapName}
                                                onChange={(event) => setNewSubmapName(event.target.value)}
                                            />

                                            <div className="rename-buttons">
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        setRenamingSubmap(null);
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();

                                                        if (newSubmapName.trim() === '') return;

                                                        setMaps(prevMaps => prevMaps.map(map => map.id === renamingSubmap.mapId ? {
                                                            ...map,
                                                            submaps: map.submaps.map(submap =>
                                                                submap.id === renamingSubmap.submapId ? {
                                                                    ...submap,
                                                                    name: newSubmapName.trim()
                                                                }
                                                                :submap
                                                        )}
                                                        :map
                                                        ))
                                                        setRenamingSubmap(null);
                                                        setNewSubmapName('');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>                                     
                                        </div>

                                    </div>
                                )
                            }

                            {deletingSubmap &&
                                deletingSubmap.mapId === map.id &&
                                deletingSubmap.submapId === submap.id && (
                                    <div className="rename-overlay">
                                        <div 
                                            className="delete-popup"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <h3>Delete Submap?</h3>
                                            <p>Are you sure you want to delete "{submap.name}"?</p>

                                            <div className="delete-buttons">
                                                <button
                                                    onClick={() => setDeletingSubmap(null)}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setMaps(maps.map(map =>
                                                        map.id === deletingSubmap.mapId ? {
                                                            ...map,
                                                            submaps: map.submaps.filter(
                                                                submap =>
                                                                    submap.id !== deletingSubmap.submapId
                                                            )
                                                        }
                                                        :map
                                                    ))
                                                    setDeletingSubmap(null);
                                                    }}
                                                >
                                                    Delete
                                                </button>      
                                            </div>
                                        </div>
                                    </div>     
                                )                                     
                            }
                            </div>
                                    ))}
                                </div>
                            )}

                            {customizingMap === map.id && (
                                <div ref={menuRef} className="customization-menu">
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        setNewMapName(map.name);
                                        setRenamingMap(map.id);
                                        setCustomizingMap(null);
                                    }}>
                                        rename
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        setNewColor(map.color);
                                        setChangingColor({
                                            mapId: map.id,
                                            submapId: null
                                        });
                                        setCustomizingMap(null);
                                    }}>
                                        change color
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        // Implementation for invite
                                    }}>
                                        invite collaborator
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        // Implementation for view collaborators
                                    }}>
                                        view collaborators
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        setNewSubmapName('');
                                        setAddingSubmap(map.id);
                                        setCustomizingMap(null);
                                    }}>
                                        add submap
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        setDeletingMap(map.id);
                                        setCustomizingMap(null);
                                    }}>
                                        delete 
                                    </button>
                                </div>
                            )}

                            {/*shows the change color popup for the matching map id.*/}
                            {changingColor &&
                            changingColor.mapId === map.id && (
                                <div className="rename-overlay">
                                    <div 
                                        className="rename-popup"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <h3>Change Color</h3>

                                        <input
                                            type="color"
                                            value={newColor}
                                            onChange={(event) => setNewColor(event.target.value)}
                                        />

                                        <div className="rename-buttons">
                                            <button onClick={() => setChangingColor(null)}>
                                                Cancel
                                            </button>

                                            <button onClick={() => {
                                                setMaps(prevMaps => prevMaps.map(map => {
                                                    if (map.id !== changingColor.mapId) {
                                                        return map;
                                                    }

                                                    // if a submap is being changed.
                                                    if (changingColor.submapId !== null) {
                                                        return {
                                                            ...map,
                                                            submaps: map.submaps.map(submap =>
                                                                submap.id === changingColor.submapId
                                                                    ? { ...submap, color: newColor }
                                                                    : submap
                                                            )
                                                        };
                                                    }

                                                    // else change the map color.
                                                    return {
                                                        ...map,
                                                        color: newColor
                                                    };
                                                }));

                                                setChangingColor(null);
                                            }}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*shows the rename popup for the matching map id.*/}
                            {renamingMap === map.id && (
                                <div className="rename-overlay">
                                    <div className="rename-popup">
                                        <h3>Rename Map</h3>
                                        <input 
                                        type="text"
                                        placeholder="Enter new map name."
                                        value={newMapName}
                                        onChange={(event) => setNewMapName(event.target.value)}
                                        />
                                        <div className="rename-buttons">
                                            <button onClick={() => setRenamingMap(null)}>
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (newMapName.trim() === '') return;

                                                    setMaps(
                                                        maps.map(map => map.id === renamingMap ? {...map, name: newMapName.trim() }
                                                        : map)
                                                    )
                                                    setRenamingMap(null);
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*Shows the delete popup for the matching map id.*/}
                            {deletingMap === map.id && (
                                <div className="rename-overlay">
                                    <div className="delete-popup">
                                        <h3>Delete Map?</h3>
                                        <p>Are you sure you want to delete "{map.name}"?</p>

                                        <div className="delete-buttons">
                                            <button onClick={() =>  setDeletingMap(null)}>
                                                Cancel
                                            </button>

                                            <button onClick={() => {
                                                setMaps(maps.filter(map => map.id !== deletingMap)
                                                )
                                                setDeletingMap(null);
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*Shows the adding submap popup to add to the matching map id.*/}
                            {addingSubmap === map.id && (
                                <div className="rename-overlay">
                                    <div 
                                        className="rename-popup"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <h3>Add Submap</h3>

                                        <input
                                            type="text"
                                            placeholder="Enter submap name"
                                            value={newSubmapName}
                                            onChange={(event) => setNewSubmapName(event.target.value)}
                                        />

                                        <div className="rename-buttons">
                                            <button onClick={() => setAddingSubmap(null)}>
                                                    Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (newSubmapName.trim() === '') return;
                                                    setMaps(maps.map(map =>
                                                        map.id === addingSubmap ? {
                                                            ...map, visible: false,
                                                            submaps: [...map.submaps, {
                                                                id: Date.now(),
                                                                name: newSubmapName.trim(),
                                                                visible: false,
                                                                color: '#3388ff'
                                                            }]
                                                        }
                                                        : map
                                                    ))
                                                    setAddingSubmap(null);
                                                }}
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <button className="add-map-button" 
                    onClick={(event) => {
                        event.stopPropagation();
                        setNewMapName('');
                        setAddingMap(true);
                        setCustomizingMap(null);
                    }}
                >
                    Add Map
                </button>

                {addingMap && (
                    <div className="rename-overlay">
                        <div className="rename-popup">
                            <h3>Add Map</h3>

                            <input
                                type="text"
                                placeholder="Enter map name"
                                value={newMapName}
                                onChange={(event) => setNewMapName(event.target.value)}
                            />
                        

                            <div className="rename-buttons">
                                <button onClick={() => setAddingMap(false)}
                                > Cancel</button>
                                
                                <button onClick={() => {
                                    if (newMapName.trim() === '') return;

                                    const newMap = {
                                        id: Date.now(),
                                        name: newMapName.trim(),
                                        visible: false,
                                        isDefault: false,
                                        color: '#3388ff',
                                        submaps: []
                                    };

                                    setMaps([...maps, newMap]);
                                    setAddingMap(false);
                                }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            
        </aside>
    )
}

export default MapSidebar;