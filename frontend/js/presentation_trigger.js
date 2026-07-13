/**
 * ASGARD Presentation Mode Trigger
 * Adds a hidden/convenient way to start/stop the 10-minute demo.
 */

async function startPresentationMode() {
    if (confirm("The 10-minute Presentation Mode (IT & IoT Crisis) will be started. Are you sure?")) {
        try {
            const token = localStorage.getItem('asgard_token');
            const response = await fetch('http://127.0.0.1:5003/api/demo/presentation-start', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            if (response.ok) {
                if (window.showAIToast) {
                    showAIToast("Presentation Mode Active", "10-minute anomaly scenario started.", "OK", "critical");
                } else if (window.showToast) {
                    showToast("Presentation mode activated.", "success");
                } else {
                    alert(data.message);
                }
                
                // Refresh UI if needed
                if (window.checkDemoStatus) window.checkDemoStatus();
            } else {
                alert("Error: " + data.detail);
            }
        } catch (error) {
            console.error("Presentation trigger error:", error);
            alert("Could not start presentation mode.");
        }
    }
}

async function stopPresentationMode() {
    try {
        const token = localStorage.getItem('asgard_token');
        const response = await fetch('http://127.0.0.1:5003/api/demo/presentation-stop', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        if (response.ok) {
            if (window.showAIToast) {
                showAIToast("Presentation Mode Off", "System is returning to real-time data.", "OK", "stable");
            } else if (window.showToast) {
                showToast("Presentation mode stopped.", "info");
            } else {
                alert(data.message);
            }
            
            // Refresh UI if needed
            if (window.checkDemoStatus) window.checkDemoStatus();
        } else {
            alert("Error: " + data.detail);
        }
    } catch (error) {
        console.error("Presentation stop error:", error);
        alert("Could not stop presentation mode.");
    }
}

// Add global functions to be called from UI
window.asgardStartDemo = startPresentationMode;
window.asgardStopDemo = stopPresentationMode;
