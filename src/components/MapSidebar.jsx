import './MapSidebar.css';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

function MapSidebar({ isOpen, setIsOpen, maps, setMaps }) {
    
    // Keeps track of which map is currently being customized with null meaning no map is being customized.
    const [customizingMap, setCustomizingMap] = useState(null);
    
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

    // Renames a map by its ID.
    function renameMap(id) {
        const map = maps.find(map => map.id === id);
        const newName = prompt('Enter new name for the map:', map.name);

        // If the user cancels the prompt or enters an empty name, does nothing.
        if (newName === null || newName.trim() === '') return;

        // creates a new array of maps with the updated name for the specified map.
        setMaps(maps.map(map => map.id === id ? { ...map, name: newName.trim() } : map));

        // closes menu after renaming the map.
        setCustomizingMap(null);
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
                                        renameMap(map.id);
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
                                        // Implementation for submap
                                    }}>
                                        add submap
                                    </button>
                                    <button onClick={(event) => {
                                        event.stopPropagation();
                                        // Implementation for delete
                                    }}>
                                        delete 
                                    </button>
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