import './MapSidebar.css';
import { useState } from 'react';

function MapSidebar({ isOpen, setIsOpen, maps, setMaps }) {
    const [customizingMap, setCustomizingMap] = useState(null);

    function toggleMap(id) {
        setMaps(maps.map(map => map.id === id ? { ...map, visible: !map.visible } : map));
    }
    
    return (
        <aside className={`map-sidebar ${isOpen ? 'open' : 'closed'}`}>

            <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
            
            <div className="sidebar-content">
                <header className="sidebar-header">
                    <h2>My Maps</h2>
                </header>

                <div className="map-list">
                    {maps.map((map) => (
                        <div key={map.id} className="map-item-container">
                            <div className="map-item" onClick={() => toggleMap(map.id)}>
                                <input
                                    type="checkbox"
                                    checked={map.visible}
                                    onChange={() => toggleMap(map.id)}
                                    onClick={(event) => event.stopPropagation()}
                                />
                                <span className="map-name">{map.name}</span>
                                {!map.isDefault && (
                                    <button 
                                    className="map-menu-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setCustomizingMap(customizingMap === map.id ? null : map.id);
                                    }}
                                    >⋮</button>
                                )}
                            </div>

                            {customizingMap === map.id && (
                                <div className="customization-menu">
                                    <button>rename</button>
                                    <button>invite</button>
                                    <button>delete</button>
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