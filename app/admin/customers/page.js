"use client";
import { useState, useEffect } from "react";
import { useNotifications } from '@/components/Notifications';
import { formatPrice } from "@/lib/utils";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());
  const { success, error, warning } = useNotifications();
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('Fetching customers...');
      
      const timestamp = Date.now(); // Add timestamp to prevent caching
      const response = await fetch(`/api/admin/users?t=${timestamp}`, {
        method: 'GET',
        cache: 'no-cache', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      console.log('Fetched customers data:', data);
      console.log('Customers count:', data.users?.length || 0);
      
      if (data.success) {
        setCustomers(data.users);
        console.log('Customers updated in UI:', data.users.length);
        console.log('Customer emails in UI:', data.users.map(u => u.email));
      } else {
        console.error('Failed to fetch customers:', data.error);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteCustomer = async (customerId, customerEmail) => {
    console.log('Delete function called with:', { customerId, customerEmail });
    
    // Show custom confirmation dialog instead of browser confirm
    setConfirmDialog({
      title: 'Delete Customer',
      message: `Are you sure you want to delete customer ${customerEmail}? This action cannot be undone.`,
      onConfirm: () => performDelete(customerId, customerEmail),
      onCancel: () => setConfirmDialog(null)
    });
  };

  const performDelete = async (customerId, customerEmail) => {
    setConfirmDialog(null); // Close dialog
    
    try {
      console.log('Making DELETE request to:', `/api/admin/users/${customerId}`);
      
      const response = await fetch(`/api/admin/users/${customerId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (data.success) {
        success('Customer deleted successfully');
        // Force refresh by clearing cache and refetching
        setCustomers([]);
        await fetchCustomers();
      } else {
        error(data.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      error('Failed to delete customer. Please try again.');
    }
  };
  
  const handleSelectCustomer = (customerId) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };
  
  const handleSelectAll = () => {
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(customers.map(c => c.id)));
    }
  };
  
  const deleteSelectedCustomers = async () => {
    if (selectedCustomers.size === 0) {
      warning('No customers selected');
      return;
    }
    
    setConfirmDialog({
      title: 'Delete Multiple Customers',
      message: `Are you sure you want to delete ${selectedCustomers.size} customer(s)? This action cannot be undone.`,
      onConfirm: () => performBulkDelete(),
      onCancel: () => setConfirmDialog(null)
    });
  };
  
  const performBulkDelete = async () => {
    setConfirmDialog(null);
    
    try {
      const deletePromises = Array.from(selectedCustomers).map(customerId =>
        fetch(`/api/admin/users/${customerId}`, { method: 'DELETE' })
      );
      
      const results = await Promise.all(deletePromises);
      const failedDeletes = results.filter(res => !res.ok).length;
      
      if (failedDeletes === 0) {
        success(`Successfully deleted ${selectedCustomers.size} customer(s)`);
      } else {
        warning(`Deleted ${selectedCustomers.size - failedDeletes} customer(s), ${failedDeletes} failed`);
      }
      
      setSelectedCustomers(new Set());
      setCustomers([]);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customers:', error);
      error('Failed to delete some customers. Please try again.');
    }
  };

  return (
    <div style={{ padding:32, maxWidth: "100%" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:6 }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a2e", margin:0 }}>Customers</h1>
          {selectedCustomers.size > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color:"#64748b", fontSize:14 }}>
                {selectedCustomers.size} selected
              </span>
              <button
                onClick={deleteSelectedCustomers}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#ef4444';
                }}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        <p style={{ color:"#64748b", fontSize:14, margin:0 }}>{customers.length} registered customers</p>
      </div>
      <div style={{ 
        background:"#fff", 
        borderRadius:16, 
        border:"1px solid #e8f0fe", 
        overflowX: "auto",
        overflowY: "visible"
      }}>
        {loading ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8", minWidth: "800px" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding:"60px 0", textAlign:"center", color:"#94a3b8", minWidth: "800px" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
            <p>No customers yet.</p>
          </div>
        ) : (
          <div style={{ minWidth: "1200px" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"center", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "60px"
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.size === customers.length && customers.length > 0}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "200px"
                  }}>Customer</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "250px"
                  }}>Email</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "120px"
                  }}>City</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "100px"
                  }}>Orders</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "150px"
                  }}>Total Spent</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "150px"
                  }}>Last Order</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "120px"
                  }}>Status</th>
                  <th style={{ 
                    padding:"14px 20px", 
                    textAlign:"left", 
                    color:"#64748b", 
                    fontSize:11, 
                    fontWeight:700, 
                    letterSpacing:1, 
                    textTransform:"uppercase", 
                    borderBottom:"1px solid #e8f0fe",
                    width: "120px",
                    position: "sticky",
                    right: 0,
                    background: "#f8fafc",
                    zIndex: 10,
                    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)"
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"16px 20px", textAlign: "center", width: "60px" }}>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding:"16px 20px", width: "200px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:38, height:38, background:"#0057a8", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15 }}>{customer.name ? customer.name[0] : "U"}</div>
                        <span style={{ fontWeight:600, color:"#1a1a2e", fontSize:14 }}>{customer.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13, width: "250px", wordBreak: "break-word" }}>{customer.email}</td>
                    <td style={{ padding:"16px 20px", color:"#64748b", fontSize:13, width: "120px" }}>{customer.city || "—"}</td>
                    <td style={{ padding:"16px 20px", width: "100px" }}><span style={{ background:"#eff6ff", color:"#0057a8", padding:"3px 10px", borderRadius:20, fontSize:13, fontWeight:700 }}>{customer.orders || 0}</span></td>
                    <td style={{ padding:"16px 20px", fontWeight:700, color:"#0057a8", fontSize:14, width: "150px" }}>{formatPrice(customer.spent || 0)}</td>
                    <td style={{ padding:"16px 20px", color:"#94a3b8", fontSize:13, width: "150px" }}>{customer.lastOrder || "—"}</td>
                    <td style={{ padding:"16px 20px", width: "120px" }}>
                      <span style={{ 
                        background: customer.emailVerified ? "#dcfce7" : "#fef3c7", 
                        color: customer.emailVerified ? "#166534" : "#92400e", 
                        padding:"3px 10px", 
                        borderRadius:20, 
                        fontSize:13, 
                        fontWeight:700,
                        display: "inline-block"
                      }}>
                        {customer.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td style={{ 
                      padding:"16px 20px", 
                      width: "120px",
                      position: "sticky", 
                      right: 0, 
                      background: "#fff", 
                      zIndex: 10,
                      boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
                      borderLeft: "1px solid #f1f5f9"
                    }}>
                      <button
                        onClick={() => {
                          const customerId = customer.id || customer._id;
                          console.log('Delete button clicked for:', customer.email);
                          console.log('Customer ID:', customerId);
                          console.log('Full customer object:', customer);
                          deleteCustomer(customerId, customer.email);
                        }}
                        style={{
                          background: "#ff0000",
                          color: "#ffffff",
                          border: "2px solid #ff0000",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "36px",
                          position: "relative",
                          zIndex: 1000,
                          visibility: "visible",
                          opacity: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          gap: "4px"
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = "#cc0000";
                          e.target.style.borderColor = "#cc0000";
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = "#ff0000";
                          e.target.style.borderColor = "#ff0000";
                        }}
                      >
                        <span style={{ fontSize: "14px" }}>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Custom Confirmation Dialog */}
      {confirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a1a2e'
            }}>
              {confirmDialog.title}
            </h3>
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              {confirmDialog.message}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={confirmDialog.onCancel}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#ef4444';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}