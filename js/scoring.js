// Common scoring values for both Windows and Linux
const FEATURES_DICT_VALUED = {
    "Yes": 1,
    "No": 0,
    "Via EnablingTelemetry": 1,
    "Partially": 0.5,
    "Via EventLogs": 0.5,
    "Pending Response": 0
};

// Windows-specific categories
const WINDOWS_CATEGORIES_VALUED = {
    "Process Creation": 1,
    "Process Termination": 0.5,
    "Process Access": 1,
    "Image/Library Loaded": 1,
    "Remote Thread Creation": 1,
    "Process Tampering Activity": 1,
    "File Creation": 1,
    "File Opened": 1,
    "File Deletion": 1,
    "File Modification": 1,
    "File Renaming": 0.7,
    "Local Account Creation": 1,
    "Local Account Modification": 1,
    "Local Account Deletion": 0.5,
    "Account Login": 0.7,
    "Account Logoff": 0.4,
    "TCP Connection": 1,
    "UDP Connection": 1,
    "URL": 1,
    "DNS Query": 1,
    "File Downloaded": 1,
    "MD5": 1,
    "SHA": 1,
    "IMPHASH": 1,
    "Key/Value Creation": 1,
    "Key/Value Modification": 1,
    "Key/Value Deletion": 0.7,
    "Scheduled Task Creation": 0.7,
    "Scheduled Task Modification": 0.7,
    "Scheduled Task Deletion": 0.5,
    "Service Creation": 1,
    "Service Modification": 0.7,
    "Service Deletion": 0.6,
    "Driver Loaded": 1,
    "Driver Modification": 1,
    "Driver Unloaded": 1,
    "Virtual Disk Mount": 0.5,
    "USB Device Unmount": 0.7,
    "USB Device Mount": 1,
    "Group Policy Modification": 0.3,
    "Pipe Creation": 0.8,
    "Pipe Connection": 1,
    "Agent Start": 0.2,
    "Agent Stop": 0.8,
    "Agent Install": 0.2,
    "Agent Uninstall": 1,
    "Agent Keep-Alive": 0.2,
    "Agent Errors": 0.2,
    "WmiEventConsumerToFilter": 1,
    "WmiEventConsumer": 1,
    "WmiEventFilter": 1,
    "BIT JOBS Activity": 1,
    "Script-Block Activity": 1
};

// Linux-specific categories
const LINUX_CATEGORIES_VALUED = {
    "Process Creation": 1,
    "Process Termination": 0.5,
    "File Creation": 1,
    "File Modification": 1,
    "File Deletion": 1,
    "User Logon": 0.7,
    "User Logoff": 0.4,
    "Logon Failed": 1,
    "Script Content": 1,
    "Network Connection": 1,
    "Network Socket Listen": 1,
    "DNS Query": 1,
    "Scheduled Task": 0.7,
    "User Account Created": 1,
    "User Account Modified": 1,
    "User Account Deleted": 0.5,
    "Driver Load": 1,
    "Driver Modification": 1,
    "Image Load": 1,
    "eBPF Event": 1,
    "Raw Access Read": 1,
    "Process Access": 1,
    "Process Tampering": 1,
    "Service Creation": 1,
    "Service Modification": 0.7,
    "Service Deletion": 0.6,
    "Agent Start": 0.2,
    "Agent Stop": 0.8,
    "MD5": 1,
    "SHA": 1,
    "IMPHASH": 1
};

// Function to calculate scores with platform-specific categories
function calculateScores(data, platform = 'windows') {
    const categories = platform.toLowerCase() === 'linux' ? 
        LINUX_CATEGORIES_VALUED : WINDOWS_CATEGORIES_VALUED;

    const edrHeaders = Object.keys(data[0]).filter(
        key => key !== 'Telemetry Feature Category' && key !== 'Sub-Category'
    );

    // Initialize scores object for each EDR
    let scores = edrHeaders.map(edr => ({ edr: edr, score: 0 }));

    data.forEach(entry => {
        const subCategory = entry['Sub-Category'];
        const featureWeight = categories[subCategory] || 0;

        edrHeaders.forEach((edr, index) => {
            const status = entry[edr];
            const statusValue = FEATURES_DICT_VALUED[status] !== undefined ? 
                FEATURES_DICT_VALUED[status] : 0;
            const scoreIncrement = statusValue * featureWeight;
            scores[index].score += scoreIncrement;
        });
    });

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

    return scores;
}
