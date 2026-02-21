import React, { useEffect, useState } from 'react';
import { getDepartments, createDept } from '../services/api.js';

export default function Departments() {
    const [depts, setDepts] = useState([]);
    const [form, setForm] = useState({ name: '', code: '', description: '' });
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    async function load() { getDepartments().then(r => setDepts(r.data.data)); }
    useEffect(() => { load(); }, []);

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.name || !form.code) return;
        setLoading(true);
        try { await createDept(form); setForm({ name: '', code: '', description: '' }); setAdding(false); load(); }
        finally { setLoading(false); }
    }

    return (
        <div className="admin-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="admin-page__title" style={{ margin: 0 }}>🏛️ Departments</h1>
                <button className="suvi-btn suvi-btn--primary" onClick={() => setAdding(!adding)}>
                    {adding ? '✕ Cancel' : '+ Add Department'}
                </button>
            </div>

            {adding && (
                <form className="card" onSubmit={handleAdd} style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="suvi-input-group">
                        <label className="suvi-input-group__label">Name *</label>
                        <input className="suvi-input-group__field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Department name" required />
                    </div>
                    <div className="suvi-input-group">
                        <label className="suvi-input-group__label">Code *</label>
                        <input className="suvi-input-group__field" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. WATER" maxLength={10} required />
                    </div>
                    <div className="suvi-input-group" style={{ flex: 1, minWidth: 200 }}>
                        <label className="suvi-input-group__label">Description</label>
                        <input className="suvi-input-group__field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
                    </div>
                    <button className="suvi-btn suvi-btn--primary" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {depts.map(d => (
                    <div key={d.id} className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.3rem' }}>{d.name}</div>
                        <div style={{ display: 'inline-block', background: '#e8eefb', color: '#1a56db', borderRadius: 999, padding: '.2rem .7rem', fontSize: '.75rem', fontWeight: 700, marginBottom: '.5rem' }}>{d.code}</div>
                        {d.description && <div style={{ fontSize: '.82rem', color: '#6b7280' }}>{d.description}</div>}
                        <div style={{ marginTop: '.5rem' }}>
                            <span style={{ fontSize: '.75rem', color: d.isActive ? '#065f46' : '#991b1b', fontWeight: 600 }}>
                                {d.isActive ? '● Active' : '○ Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
