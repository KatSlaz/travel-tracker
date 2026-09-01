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
    const [expandedMaps, setExpandedMaps] = useState([]);
    const menuRef = useRef(null);
    
    // Closes the customization menu if the user clicks outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setCustomizingMap(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggles the visibility of a map by its ID and all its submaps.
    function toggleMap(id) {
        setMaps(maps.map(map => {
            if (map.id !== id) {
                return map;
            }

            //if has submaps toggle all of them
            if (map.submaps.length > 0) {
                const newVisibility = !map.visible;

                return {
                    ...map,
                    visible: newVisibility,
                    submaps: map.submaps.map(submap => ({
                        ...submap,
                        visible: newVisibility
                    }))
                }
            }

            //if no submaps then the map toggles normally.
            return {
                ...map,
                visible: !map.visible
            };
        }));
    }

    //toggles the visibility of a submap by its ID and updates the parent map visibility.
    function toggleSubmap(mapId, submapId) {
        setMaps(maps.map(map=> {
            if (map.id !== mapId) {
                return map;
            }

            const updatedSubmaps = map.submaps.map(submap =>
                submap.id === submapId
                ? { ...submap, visible: !submap.visible} : submap
            )

            //parent is checked only if all submaps are checked.
            const allSubmapsVisible = updatedSubmaps.every(
                submap => submap.visible
            )

            return {
                ...map,
                visible: allSubmapsVisible,
                submaps: updatedSubmaps
            }
        }))
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

                                    <span className="map-name">{map.name}</span>

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
                                        <div key={submap.id} className="submap-item">
                                            <input
                                                type="checkbox"
                                                checked={submap.visible}
                                                onChange={() => toggleSubmap(map.id, submap.id)}
                                                onClick={(event) => event.stopPropagation()}
                                            />
                                            <span>{submap.name}</span>
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
                                        // Implementation for changing color
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
                                    <div className="rename-popup">
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
                                                            ...map, submaps: [...map.submaps, {
                                                                id: Date.now(),
                                                                name: newSubmapName.trim(),
                                                                visible: true
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
            </div>
            
        </aside>
    )
}

export default MapSidebar;