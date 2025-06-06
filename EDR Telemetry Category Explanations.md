We are focused on collecting this telemetry directly from reliable system sources, not through correlation or inference from unrelated activities. More on this distinction: [EDR Telemetry Eligibility – Telemetry vs. Inferred](https://www.edr-telemetry.com/eligibility#telemetry-vs-inferred-comparison).

## **▸ Process Activity**

This category focuses on the telemetry associated with the lifecycle and manipulation of processes on the system. It is foundational for establishing visibility into execution flow, child-parent relationships, and process-based techniques such as injection or tampering.

### **▸ Process Creation**

* **Definition:** Captures the instantiation of a new process on the system, including the parent-child relationship, full command line, process ID, and image path.  
* **Purpose:** Provides the foundation for execution visibility. Used to map process trees, identify suspicious binaries, or track execution lineage in both detection and hunting workflows.

### **▸ Process Termination**

* **Definition:** Records the exit or termination of a process, including exit codes and runtime.  
* **Purpose:** Complements process creation telemetry. Useful for identifying processes that were forcefully terminated, short-lived processes, or processes involved in evasion techniques.

### **▸ Process Access**

* **Definition:** Tracks when one process opens a handle to another using access rights (e.g., PROCESS\_VM\_READ, PROCESS\_QUERY\_INFORMATION), often via OpenProcess.  
* **Purpose:** Important for visibility into lateral process interaction, often used in credential access and injection techniques. A key telemetry point for assessing suspicious access patterns between processes.

### **▸ Image/Library Loaded**

* **Definition:** Captures the loading of modules (e.g., DLLs) into a process's address space.  
* **Purpose:** Expands visibility into module-based execution. DLL loads can indicate legitimate dependencies or execution of malicious payloads. Baseline visibility ensures unusual or unsigned modules can be flagged or reviewed.

### **▸ Remote Thread Creation**

* **Definition:** Occurs when a thread is created in a process other than the calling process, typically using CreateRemoteThread or similar APIs.  
* **Purpose:** Critical for detecting process injection and lateral movement techniques. Helps expose attacker attempts to hijack legitimate processes for stealth.

### **▸ Process Tampering Activity**

* **Definition:** Involves direct manipulation of process memory, metadata, or behavior (e.g., hollowing, unmapping, APC injection).  
* **Purpose:** Surface-level coverage of advanced evasion and stealth techniques that alter process execution context or memory layout.

### **▸ Process Call Stacks**

* **Definition:** Captures the stack trace of a process during key events like network access, file writes, or API calls.  
* **Purpose:** Enhances attribution of actions to specific code origins. Provides forensic context and fine-grained hunting capabilities during runtime events.

## **File Manipulation**

This category tracks file-level interactions which are essential for uncovering persistence mechanisms, staging activity, payload delivery, and destructive actions.

### **▸ File Creation**

* **Definition:** Records when a new file is written to disk.  
* **Purpose:** Identifies artifact creation associated with malware staging, configuration drops, or script deployment.

### **▸ File Opened**

* **Definition:** Captures when an existing file is accessed or read.  
* **Purpose:** Useful for uncovering reconnaissance behavior or attempts to access sensitive documents and binaries.

### **▸ File Deletion**

* **Definition:** Tracks the removal of a file from disk.  
* **Purpose:** Detects potential evidence wiping, cleanup procedures, or malware attempting to erase its traces.

### **▸ File Modification**

* **Definition:** Captures when an existing file is altered.  
* **Purpose:** Provides visibility into malicious configuration updates, tampering, or related techniques.

### **▸ File Renaming**

* **Definition:** Detects when a file’s name or path is changed.  
* **Purpose:** Highlights evasion behavior such as renaming malware to masquerade as a benign executable.

## **User Account Activity**

This category provides insight into changes to local user accounts and authentication events. Useful for privilege escalation, persistence, and lateral movement tracking.

### **▸ Local Account Creation**

* **Definition:** Captures the creation of new local user accounts on a host.  
* **Purpose:** Important for identifying unauthorized access setup or persistence through rogue accounts.

### **▸ Local Account Modification**

* **Definition:** Tracks changes to account properties like group membership, password, or description.  
* **Purpose:** Reveals privilege escalation attempts or account manipulation.

### **▸ Local Account Deletion**

* **Definition:** Detects removal of local user accounts.  
* **Purpose:** Indicates cleanup behavior or removal of backdoor access after an operation.

### **▸ Account Login**

* **Definition:** Logs successful authentication events.  
* **Purpose:** Helps establish user session timelines and identify anomalous login activity.

### **▸ Account Logoff**

* **Definition:** Records termination of a user session.  
* **Purpose:** Complements login telemetry and can reveal short-lived or scripted logins.

## **Network Activity**

This category tracks outbound and inbound connections, name resolution, and download behavior to establish context around external communication and potential command-and-control.

### **▸ TCP Connection**

* **Definition:** Records when a TCP connection is initiated.  
* **Purpose:** Allows tracking of command-and-control infrastructure and lateral movement via common ports.

### **▸ UDP Connection**

* **Definition:** Tracks stateless UDP-based communication.  
* **Purpose:** Essential for visibility into DNS, NTP, or other low-noise communication methods.

### **▸ URL**

* **Definition:** Captures full URLs accessed by the host.  
* **Purpose:** Valuable for detecting initial access vectors, phishing infrastructure, or payload retrieval.

### **▸ DNS Query**

* **Definition:** Logs domain name system (DNS) queries initiated by the host.  
* **Purpose:** Useful for detecting beaconing behavior, DGA domains, or malware resolving its C2 domain.

### **▸ File Downloaded**

* **Definition:** Detects when files are retrieved from external locations.  
* **Purpose:** Captures payload delivery from external or internal infrastructure.

## **Hash Algorithms**

This category focuses on the fingerprinting of files or memory regions using hashing algorithms to allow deduplication, integrity checks, and malware correlation.

### **▸ MD5**

* **Definition:** Records the MD5 hash of a file or memory region.  
* **Purpose:** Legacy support. Still used in many IOC feeds for matching known threats.

### **▸ SHA**

* **Definition:** Captures either SHA1 or SHA256 hashes.  
* **Purpose:** Widely used across threat intel and VT correlations for file integrity and detection.

### **▸ IMPHASH**

* **Definition:** Captures the Import Hash of a PE file.  
* **Purpose:** Useful for grouping malware families by import table similarity.

## **Registry Activity**

This category includes telemetry on registry operations that can indicate persistence mechanisms, configuration changes, and attacker tooling setup.

### **▸ Key/Value Creation**

* **Definition:** Records creation of new registry keys or values.  
* **Purpose:** Supports detection of persistence setup or software installation behavior.

### **▸ Key/Value Modification**

* **Definition:** Tracks updates to existing registry values.  
* **Purpose:** Indicates potential changes to system configuration or malicious tampering.

### **▸ Key/Value Deletion**

* **Definition:** Logs when registry keys or values are removed.  
* **Purpose:** Can point to cleanup behavior, tampering, or attacker counter-forensics.

## **Scheduled Task Activity**

This category captures telemetry related to scheduled tasks, a common persistence and execution mechanism.

### **▸ Scheduled Task Creation**

* **Definition:** Detects when a new scheduled task is created.  
* **Purpose:** Provides insight into persistence or automated execution setups.

### **▸ Scheduled Task Modification**

* **Definition:** Tracks updates to an existing scheduled task.  
* **Purpose:** Highlights tampering or configuration changes.

### **▸ Scheduled Task Deletion**

* **Definition:** Detects removal of scheduled tasks.  
* **Purpose:** Indicates cleanup or changes to automated jobs.

## **Service Activity**

This category tracks Windows service changes that are often used for persistence or execution.

### **▸ Service Creation**

* **Definition:** Logs creation of a new Windows service.  
* **Purpose:** Useful for tracking persistent system-level execution points.

### **▸ Service Modification**

* **Definition:** Captures changes to an existing service.  
* **Purpose:** Can indicate reconfiguration for malicious intent.

### **▸ Service Deletion**

* **Definition:** Records removal of a service.  
* **Purpose:** Suggests cleanup or anti-forensics activities.

## **Driver/Module Activity**

This category monitors kernel-level drivers and modules that may affect the stability, security, or integrity of the system.

### **▸ Driver Loaded**

* **Definition:** Logs when a kernel driver or module is loaded.  
* **Purpose:** Key for rootkit detection and monitoring signed/unsigned driver behavior.

### **▸ Driver Modification**

* **Definition:** Captures when an existing driver is altered.  
* **Purpose:** Indicates tampering or unauthorized code modification.

### **▸ Driver Unloaded**

* **Definition:** Detects when a driver is removed from memory.  
* **Purpose:** Useful for detecting stealthy operations involving kernel-level evasion.

## **Device Operations**

This category provides telemetry related to physical and virtual devices, especially removable or mountable media.

### **▸ Virtual Disk Mount**

* **Definition:** Logs mounting of VHDs, ISOs, or other virtual disk images.  
* **Purpose:** Highlights staging behavior or use of containerized payloads.

### **▸ USB Device Mount**

* **Definition:** Detects insertion and mount of USB devices.  
* **Purpose:** Monitors for data exfiltration or unauthorized device usage.

### **▸ USB Device Unmount**

* **Definition:** Tracks dismount/removal of USB storage.  
* **Purpose:** Complements mount events and assists with timeline reconstruction.

## **Other Relevant Events**

These events offer supplementary visibility into critical system-level changes or access points.

### **▸ Group Policy Modification**

* **Definition:** Captures changes made to group policy objects or local policy settings.  
* **Purpose:** Important for tracking unauthorized configuration changes or policy abuse.

## **Named Pipe Activity**

Named pipes are a common method for inter-process communication (IPC) and are often used in lateral movement and evasion.

### **▸ Pipe Creation**

* **Definition:** Detects creation of named pipes.  
* **Purpose:** Helps identify malicious IPC channels or staging behavior.

### **▸ Pipe Connection**

* **Definition:** Captures connections to named pipes.  
* **Purpose:** Useful for identifying malware communication or post-exploitation frameworks.

## **EDR SysOps**

This category includes operational telemetry from the EDR agent itself to track its lifecycle and health.

### **▸ Agent Start**

* **Definition:** Logs when the EDR agent starts running.  
* **Purpose:** Useful for visibility into agent uptime and troubleshooting startup issues.

### **▸ Agent Stop**

* **Definition:** Records when the agent stops unexpectedly or is shut down.  
* **Purpose:** Critical for detecting tampering or evasion attempts.

### **▸ Agent Install**

* **Definition:** Captures installation events of the EDR agent.  
* **Purpose:** Confirms successful deployment and helps timeline deployments.

### **▸ Agent Uninstall**

* **Definition:** Detects uninstallation or removal of the EDR product.  
* **Purpose:** Important for visibility into tampering or rollback.

### **▸ Agent Keep-Alive**

* **Definition:** Indicates heartbeat or health check-ins from the agent.  
* **Purpose:** Confirms that agents are active and reporting.

### **▸ Agent Errors**

* **Definition:** Logs any errors or faults generated by the agent.  
* **Purpose:** Important for triaging failures or understanding gaps in protection.

## **WMI Activity**

This category focuses on Windows Management Instrumentation activity, which is often abused for persistence, execution, and reconnaissance.

### **▸ WmiEventConsumerToFilter**

* **Definition:** Captures binding relationships between WMI filters and consumers.  
* **Purpose:** Crucial for understanding execution triggers and persistence setup.

### **▸ WmiEventConsumer**

* **Definition:** Logs creation or modification of WMI consumers.  
* **Purpose:** Identifies the script, command, or binary that will be executed.

### **▸ WmiEventFilter**

* **Definition:** Detects creation or modification of WMI filters.  
* **Purpose:** Highlights the conditions under which malicious or automated tasks may be executed.

## **BIT JOBS Activity**

This category covers telemetry related to Background Intelligent Transfer Service (BITS), a mechanism sometimes used by attackers for stealthy downloads or task scheduling.

### **▸ BIT JOBS Activity**

* **Definition:** Tracks creation, update, and execution of BITS jobs.  
* **Purpose:** Helps detect covert tasking.

## **PowerShell Activity**

This category provides visibility into PowerShell script execution, an essential component of modern threat actor toolkits.

### **▸ Script-Block Activity**

* **Definition:** Captures raw PowerShell script content and metadata from script blocks.  
* **Purpose:** Provides deep inspection capability of executed scripts, even those that are obfuscated or multi-stage.

