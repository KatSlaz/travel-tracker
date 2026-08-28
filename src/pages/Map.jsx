import Map from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import MapSidebar from '../components/MapSidebar';


function TravelMap() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [maps, setMaps] = useState([
        {
            id: 1,
            name: 'All Places',
            visible: true,
            isDefault: true,
        },
        {
            id: 2,
            name: 'My places',
            visible: false,
            isDefault: false,
        },
        {
            id: 3,
            name: 'Places to visit',
            visible: false,
            isDefault: false,
        }
    ]);

    return (
        <>
            <Navbar />

            <div className="map-page">
                <MapSidebar 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
                maps={maps}
                setMaps={setMaps}
                />

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