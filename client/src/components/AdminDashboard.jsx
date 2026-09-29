import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Clock, AlertTriangle, CheckCircle2, XCircle, Search as SearchIcon } from 'lucide-react';

export default function AdminDashboard({ api }) {
  const [activeSubTab, setActiveSubTab] = useState('audit');
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const logsRes = await api.getAuditLogs();
      if (logsRes.success) setAuditLogs(logsRes.auditLogs);

      const usersRes = await api.getUsers();
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = (userId, currentStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>
              Administrator Audit & Access Control
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#8b5cf6',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              ROLE: ADMIN
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            System-wide security monitoring, access logs, and user status controls
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={activeSubTab === 'audit' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Clock size={16} /> Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={activeSubTab === 'users' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            <Users size={16} /> Manage Users ({users.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          Loading security audit telemetry...
        </div>
      ) : activeSubTab === 'audit' ? (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>User ID</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
                <th style={{ padding: '12px 16px' }}>Outcome</th>
                <th style={{ padding: '12px 16px' }}>Event Classification</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#f8fafc', fontWeight: 500 }}>
                    {log.userId || 'Anonymous / System'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#8b5cf6', fontWeight: 600 }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: log.outcome.includes('SUCCESS') ? '#10b981' : '#f43f5e'
                    }}>
                      {log.outcome.includes('SUCCESS') ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {log.outcome}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {log.securityEvent ? (
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: 'rgba(244, 63, 94, 0.15)',
                        color: '#f43f5e',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        fontWeight: 600
                      }}>
                        SECURITY WARNING
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Standard Audit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Name</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Action Control</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', color: '#f8fafc', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                      color: user.role === 'ADMIN' ? '#8b5cf6' : '#6366f1',
                      fontWeight: 600
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: user.isActive ? '#10b981' : '#f43f5e',
                      fontWeight: 600
                    }}>
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 10px' }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
