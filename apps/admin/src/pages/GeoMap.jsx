import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { getMapData } from '../services/api.js';

export default function GeoMap() {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMapData().then(r => setPoints(r.data.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const STATUS_COLOR = { PENDING: '#92400e', IN_PROGRESS: '#1e3a8a', RESOLVED: '#065f46', ESCALATED: '#991b1b', CLOSED: '#6b7280' };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">🗺️ Geographic Issue Map</h1>
            {loading ? (
                <p style={{ color: '#6b7280' }}>Loading map data…</p>
            ) : (
                <>
                    <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '.88rem' }}>
                        Showing {points.length} geo-tagged complaint(s). Click a dot for details.
                    </p>
                    <div className="card" style={{ height: 500, overflow: 'hidden', borderRadius: 14 }}>
                        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {points.map(p => (
                                <Circle
                                    key={p.id}
                                    center={[p.latitude, p.longitude]}
                                    radius={500}
                                    pathOptions={{ color: STATUS_COLOR[p.ticket?.status] ?? '#1a56db', fillOpacity: 0.5 }}
                                >
                                    <Popup>
                                        <strong>{p.ticket?.ticketId}</strong><br />
                                        {p.department?.name}<br />
                                        <small>{p.description?.slice(0, 80)}…</small><br />
                                        <span style={{ fontWeight: 700 }}>{p.ticket?.status}</span>
                                    </Popup>
                                </Circle>
                            ))}
                        </MapContainer>
                    </div>
                    {/* Legend */}
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {Object.entries(STATUS_COLOR).map(([s, c]) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.82rem' }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                                {s}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
