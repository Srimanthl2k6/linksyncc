import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Building, Users, Server, Cloud, Network, Share2, Wifi, Shield, GitCommit, Route, Layers, Lock, Phone, HardDrive, Printer as PrinterIcon, Laptop, Smartphone, Tablet, Clipboard, Check, Home, Briefcase, IndianRupee, Bot, Send, Power } from 'lucide-react';

// --- UI Components ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-black/50 backdrop-blur-md border border-green-500/20 rounded-lg shadow-lg shadow-green-500/10 p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, className = '', variant = 'primary' }) => {
    const baseClasses = "w-full flex items-center justify-center gap-3 px-6 py-3 font-mono rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:shadow-none disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-green-500 text-black shadow-green-500/20 hover:bg-green-400 hover:shadow-green-400/30 focus:ring-green-400 focus:ring-offset-black disabled:bg-gray-700 disabled:text-gray-400",
        secondary: "bg-green-900/50 border border-green-700 text-green-300 hover:bg-green-800/50 hover:text-white focus:ring-green-500 focus:ring-offset-black disabled:bg-gray-800 disabled:text-gray-500",
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};


const Input = ({ label, type = 'text', value, onChange, placeholder, icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-green-300/70 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400/50">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-black/50 border border-green-500/30 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors text-green-200 font-mono"
      />
    </div>
  </div>
);

const DepartmentInput = ({ dept, onUpdate, onRemove, canRemove }) => {
    const [name, setName] = useState(dept.name);
    const [employees, setEmployees] = useState(dept.employees);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmployeesChange = (e) => {
        setEmployees(Math.max(1, parseInt(e.target.value) || 1));
    };

    const handleBlur = () => {
        onUpdate(dept.id, 'name', name);
        onUpdate(dept.id, 'employees', employees);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 p-2 bg-black/30 rounded-lg border border-green-800/20">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={handleBlur}
              placeholder="Department Name"
              className="w-full sm:flex-grow bg-transparent border-b border-green-600/40 focus:border-green-500 outline-none px-2 py-1 text-green-200"
            />
            <input
              type="number"
              value={employees}
              onChange={handleEmployeesChange}
              onBlur={handleBlur}
              placeholder="Employees"
              className="w-full sm:w-24 bg-transparent border-b border-green-600/40 focus:border-green-500 outline-none px-2 py-1 text-green-200"
            />
            <button onClick={() => onRemove(dept.id)} className="text-red-500 hover:text-red-600 disabled:text-gray-600 transition-colors" disabled={!canRemove}>&times;</button>
        </div>
    );
};

// --- Main Application ---
const App = () => {
  const [step, setStep] = useState(0); // 0: Hero, 0.5: Design Tier, 1: Form Step 1, 2: Form Step 2, 3: Results
  const [designTier, setDesignTier] = useState('enterprise');

  // Step 1: Basic Info
  const [numFloors, setNumFloors] = useState(3);
  const [departments, setDepartments] = useState([
      { id: 1, name: 'Sales & Marketing', employees: 18, vlan: 20 },
      { id: 2, name: 'Finance & Acc', employees: 12, vlan: 30 },
      { id: 3, name: 'HR & Logistics', employees: 10, vlan: 40 },
      { id: 4, name: 'ICT', employees: 15, vlan: 50 },
  ]);

  // Step 2: Server Info
  const [onPremServices, setOnPremServices] = useState({
    voip: true,
    file: true,
    web: true,
    dhcp: true,
    dns: true,
  });
  const [cloudServices, setCloudServices] = useState({
    m365: true,
    aws: true,
  });

  // Step 3: Generated Design
  const [networkDesign, setNetworkDesign] = useState(null);
  
  // State for interactive diagram - LIFTED UP
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const addDepartment = (name, employees) => {
    const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
    const nextVlan = departments.length > 0 ? Math.max(...departments.map(d => d.vlan)) + 10 : 10;
    setDepartments(prev => [...prev, { id: newId, name: name || '', employees: employees || 5, vlan: nextVlan }]);
  };

  const updateDepartment = (id, field, value) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };
  
  const updateDepartmentByName = (name, field, value) => {
    setDepartments(prev => prev.map(d => d.name.toLowerCase() === name.toLowerCase() ? { ...d, [field]: value } : d));
  };


  const removeDepartment = (id) => {
    if (departments.length > 1) {
      setDepartments(prev => prev.filter(d => d.id !== id));
    }
  };
  
  const removeDepartmentByName = (name) => {
    if (departments.length > 1) {
        setDepartments(prev => prev.filter(d => d.name.toLowerCase() !== name.toLowerCase()));
    }
  };


  const totalEmployees = departments.reduce((sum, dept) => sum + parseInt(dept.employees || 0, 10), 0);

  const isStep1Valid = () => {
      return numFloors > 0 && departments.every(d => d.name.trim() !== '' && d.employees > 0);
  }

  const generateNetworkDesign = () => {
    let design;
    switch (designTier) {
        case 'soho':
            design = generateSohoNetwork();
            break;
        case 'standard':
            design = generateStandardNetwork();
            break;
        case 'enterprise':
        default:
            design = generateEnterpriseNetwork();
            break;
    }
    setNetworkDesign(design);
    setNodes(design.topology.nodes);
    setLinks(design.topology.links);
    setStep(3);
  };
  
  useEffect(() => {
    if (step === 3) {
        generateNetworkDesign();
    }
  }, [departments, onPremServices, designTier]);


  const generateEnterpriseNetwork = () => {
    const design = {};
    design.tier = 'Enterprise';
    design.devices = {
        firewall: { name: 'ASA 5506-X' }, coreSwitch: { name: '3650-24PS' },
        accessSwitch: { name: '2960-24TT' }, voipGateway: { name: '2911 Router' },
    };
    const baseNetwork = `10.${Math.floor(Math.random() * 250) + 1}`;
    const dmzSubnet = `172.16.${Math.floor(Math.random() * 10)}`;
    design.ipSchema = { vlans: [
        {vlanId: 10, name: 'Management', subnet: `192.168.10.0/24`, gateway: `192.168.10.1`, dhcp: 'N/A'},
        ...departments.map(dept => ({ ...dept, vlanId: dept.vlan, name: `Data_${dept.name.replace(/[^A-Z0-9]/ig, "")}`, subnet: `${baseNetwork}.${dept.vlan}.0/24`, gateway: `${baseNetwork}.${dept.vlan}.1`, dhcp: `${baseNetwork}.${dept.vlan}.10 - .254`})),
        {vlanId: 70, name: 'VoIP', subnet: `${baseNetwork}.70.0/24`, gateway: `${baseNetwork}.70.1`, dhcp: `${baseNetwork}.70.10 - .254`},
        {vlanId: 90, name: 'SERVERS', subnet: `${baseNetwork}.90.0/24`, gateway: `${baseNetwork}.90.1`, dhcp: 'Static'},
        {vlanId: 102, name: 'DMZ', subnet: `${dmzSubnet}.0/24`, gateway: `${dmzSubnet}.1`, dhcp: 'Static'},
    ]};
    design.servers = [];
    if (onPremServices.dhcp) design.servers.push({ name: 'DHCP_Server', ip: `${baseNetwork}.90.10`, vlan: 'SERVERS' });
    if (onPremServices.dns) design.servers.push({ name: 'DNS_Server', ip: `${baseNetwork}.90.11`, vlan: 'SERVERS' });
    design.servers.push({ name: 'AAA_RADIUS', ip: `${baseNetwork}.90.12`, vlan: 'SERVERS' });
    if (onPremServices.web) design.servers.push({ name: 'Web_Server', ip: `${dmzSubnet}.10`, vlan: 'DMZ' });

    design.topology = generateTopologyDiagram(design);
    design.configs = generateDeviceConfigs(design);
    design.cablingGuide = generateCablingGuide(design.topology.links);
    return design;
  }

  const generateStandardNetwork = () => {
    const design = {};
    design.tier = 'Standard Business';
    design.devices = { router: { name: '4321 ISR' }, coreSwitch: { name: '3650-24PS' }, accessSwitch: { name: '2960-24TT' } };
    const baseNetwork = `10.${Math.floor(Math.random() * 250) + 1}`;
    design.ipSchema = { vlans: [
        ...departments.map(dept => ({ ...dept, vlanId: dept.vlan, name: `Data_${dept.name.replace(/[^A-Z0-9]/ig, "")}`, subnet: `${baseNetwork}.${dept.vlan}.0/24`, gateway: `${baseNetwork}.${dept.vlan}.1`, dhcp: `${baseNetwork}.${dept.vlan}.10 - .254`})),
        {vlanId: 90, name: 'SERVERS', subnet: `${baseNetwork}.90.0/24`, gateway: `${baseNetwork}.90.1`, dhcp: 'Static'},
    ]};
    design.servers = [];
    if (onPremServices.dhcp) design.servers.push({ name: 'DHCP_Server', ip: `${baseNetwork}.90.10`, vlan: 'SERVERS' });
    if (onPremServices.dns) design.servers.push({ name: 'DNS_Server', ip: `${baseNetwork}.90.11`, vlan: 'SERVERS' });
    design.topology = generateTopologyDiagram(design);
    design.configs = generateDeviceConfigs(design);
    design.cablingGuide = generateCablingGuide(design.topology.links);
    return design;
  }

  const generateSohoNetwork = () => {
    const design = {};
    design.tier = 'SOHO';
    design.devices = { router: { name: '1941 ISR' }, accessSwitch: { name: '2960-24TT' } };
    const baseNetwork = `192.168.${Math.floor(Math.random() * 254) + 1}`;
    design.ipSchema = { vlans: [{vlanId: 1, name: 'LAN', subnet: `${baseNetwork}.0/24`, gateway: `${baseNetwork}.1`, dhcp: `${baseNetwork}.100 - .200`}]};
    design.servers = [];
    design.topology = generateTopologyDiagram(design);
    design.configs = generateDeviceConfigs(design);
    design.cablingGuide = generateCablingGuide(design.topology.links);
    return design;
  }


  const generateTopologyDiagram = (design) => {
    let nodes = [];
    let links = [];
    
    if (design.tier === 'Enterprise') {
        nodes = [
            { id: 'cloud', label: 'Internet', x: 600, y: 80, type: 'cloud' },
            { id: 'firewall', label: 'ASA-FW', x: 600, y: 180, type: 'firewall' },
            { id: 'core1', label: 'Core-SW1', x: 400, y: 320, type: 'mlswitch' },
            { id: 'core2', label: 'Core-SW2', x: 800, y: 320, type: 'mlswitch' },
        ];
        links = [
            { source: 'cloud', target: 'firewall', type: 'Copper' }, { source: 'firewall', target: 'core1', type: 'Fiber' }, { source: 'firewall', target: 'core2', type: 'Fiber' },
            { source: 'core1', target: 'core2', type: 'Fiber' },
        ];
        if (onPremServices.voip) {
            nodes.push({ id: 'voipgw', label: 'Voice-GW', x: 150, y: 320, type: 'router' });
            links.push({ source: 'voipgw', target: 'core1', type: 'Copper' });
        }
    } else if (design.tier === 'Standard Business') {
        nodes = [
            { id: 'cloud', label: 'Internet', x: 450, y: 80, type: 'cloud' },
            { id: 'router', label: 'Edge-RTR', x: 450, y: 180, type: 'router' },
            { id: 'core1', label: 'Core-L3-SW', x: 450, y: 320, type: 'mlswitch' },
        ];
        links = [
            { source: 'cloud', target: 'router', type: 'Copper' },
            { source: 'router', target: 'core1', type: 'Copper' },
        ];
    } else { // SOHO
        nodes = [
            { id: 'cloud', label: 'Internet', x: 300, y: 80, type: 'cloud' },
            { id: 'router', label: 'SOHO-RTR', x: 300, y: 180, type: 'router' },
            { id: 'switch', label: 'LAN-SW', x: 300, y: 280, type: 'switch' },
        ];
        links = [
            { source: 'cloud', target: 'router', type: 'Copper' },
            { source: 'router', target: 'switch', type: 'Copper' },
        ];
    }
    
    let serverX = 150;
    design.servers.forEach((s) => {
        const serverId = s.name;
        if (s.vlan === 'DMZ') {
            nodes.push({ id: serverId, label: s.name, x: 600, y: 250, type: 'server' });
            links.push({ source: 'firewall', target: serverId, type: 'Copper' });
        } else {
            const coreTarget = design.tier === 'SOHO' ? 'switch' : 'core1';
            nodes.push({ id: serverId, label: s.name, x: serverX, y: 450, type: 'server' });
            if(coreTarget) links.push({ source: coreTarget, target: serverId, type: 'Copper' });
            serverX += 120;
        }
    });

    let accessX = 100;
    let switchIndex = 0;
    let totalAccessSwitches = 0;
    departments.forEach(dept => {
        totalAccessSwitches += Math.ceil(dept.employees / 20);
    });

    departments.forEach((dept) => {
        const numVlanSwitches = Math.ceil(dept.employees / 20);
        for (let j = 0; j < numVlanSwitches; j++) {
            const switchId = `Access-${dept.name.substring(0,4).toUpperCase()}-SW${j+1}`;
            const coreTarget = design.tier === 'Enterprise' ? (switchIndex % 2 === 0 ? 'core1' : 'core2') : 'core1';
            const yPos = design.tier === 'SOHO' ? 400 : 600;

            if(design.tier !== 'SOHO') {
                nodes.push({ id: switchId, label: switchId, x: accessX, y: yPos, type: 'switch', vlan: dept.vlan });
                links.push({ source: coreTarget, target: switchId, type: 'Fiber' });
            }
            
            const endDevices = [
                {id: `pc-${switchId}`, label: 'PC', type: 'pc', x: accessX - 75, y: yPos + 100},
                {id: `phone-${switchId}`, label: 'IP Phone', type: 'ipphone', x: accessX - 25, y: yPos + 100},
                {id: `laptop-${switchId}`, label: 'Laptop', type: 'laptop', x: accessX + 25, y: yPos + 100},
                {id: `printer-${switchId}`, label: 'Printer', type: 'printer', x: accessX + 75, y: yPos + 100},
            ];
            nodes.push(...endDevices);
            endDevices.forEach(dev => links.push({source: design.tier === 'SOHO' ? 'switch' : switchId, target: dev.id, type: 'Copper'}));

            accessX += 250;
            switchIndex++;
        }
    });
    
    const diagramWidth = Math.max(1200, totalAccessSwitches * 250 + 100);

    return { nodes, links, width: diagramWidth, height: 800 };
  };

  const generateDeviceConfigs = (design) => {
    const configs = {};
    const { vlans } = design.ipSchema;
    const { nodes } = design.topology;
    const baseNetwork = `10.${Math.floor(Math.random() * 250) + 1}`;
    const securityCommands = `\nenable secret class\nservice password-encryption\n`;

    if (design.tier === 'Enterprise') {
        const dmzGateway = vlans.find(v=>v.name==='DMZ').gateway;
        configs['ASA-FW'] = `! ASA Firewall Configuration
enable
password cisco
conf t
hostname ASA-FW
! Interfaces
interface GigabitEthernet1/1
 nameif outside
 security-level 0
 ip address dhcp
 no shutdown
interface GigabitEthernet1/2
 nameif inside
 security-level 100
 no ip address
 no shutdown
interface GigabitEthernet1/2.10
 vlan 10
 nameif inside_link
 ip address ${baseNetwork}.1.253 255.255.255.0
 no shutdown
interface GigabitEthernet1/3
 nameif dmz
 security-level 50
 ip address ${dmzGateway} 255.255.255.0
 no shutdown
! NAT & PAT
object network INSIDE_SUBNETS
 subnet ${baseNetwork}.0.0 255.255.0.0
nat (inside,outside) after-auto source dynamic INSIDE_SUBNETS interface
object network WEB_SERVER
 host ${design.servers.find(s => s.vlan === 'DMZ').ip}
 nat (dmz,outside) static interface service tcp www www
! Access Rules
access-list outside_access_in extended permit tcp any object WEB_SERVER eq www
access-group outside_access_in in interface outside
! Default Route
route outside 0.0.0.0 0.0.0.0 [YOUR_ISP_GATEWAY_IP] 1
exit`;

        ['Core-SW1', 'Core-SW2'].forEach((hostname, i) => {
            const isPrimary = i === 0;
            let config = `! ${hostname} Configuration
enable\nconf t\nhostname ${hostname}\n${securityCommands}`;
            config += vlans.map(v => `vlan ${v.vlanId}\n name ${v.name.replace(/\s+/g, '_').toUpperCase()}`).join('\n') + '\n';
            config += `ip routing\n`;
            vlans.filter(v => v.gateway !== 'N/A' && v.name !== 'DMZ').forEach(v => {
                config += `interface Vlan${v.vlanId}\n description ${v.name} SVI\n ip address ${v.gateway} 255.255.255.0\n`;
                config += ` standby ${v.vlanId} ip ${v.gateway.slice(0,-1)}254\n standby ${v.vlanId} priority ${isPrimary ? 110 : 100}\n standby ${v.vlanId} preempt\n no shutdown\n`;
            });
            config += `! OSPF Routing\nrouter ospf 1\n router-id 1.1.1.${i+1}\n network ${baseNetwork}.0.0 0.0.255.255 area 0\n default-information originate\nexit\n`;
            configs[hostname] = config;
        });

        if (onPremServices.voip) {
            configs['Voice-GW'] = `! Voice Gateway Configuration
enable
conf t
hostname Voice-GW
${securityCommands}
! CME Config
telephony-service
 max-ephones 20
 max-dn 20
 ip source-address ${vlans.find(v=>v.name==='VoIP').gateway} port 2000
 auto assign 1 to 20
exit
! Ephone-DNs
ephone-dn 1
 number 1001
exit
ephone-dn 2
 number 1002
exit`;
        }

    } else if (design.tier === 'Standard Business') {
        configs['Edge-RTR'] = `! Edge Router (4321 ISR) Configuration
enable
conf t
hostname Edge-RTR
${securityCommands}
! WAN Interface
interface GigabitEthernet0/0/0
 ip address dhcp
 ip nat outside
 no shutdown
! LAN Interface
interface GigabitEthernet0/0/1
 ip address ${baseNetwork}.1.254 255.255.255.0
 ip nat inside
 no shutdown
! NAT Overload
ip nat inside source list 1 interface GigabitEthernet0/0/0 overload
access-list 1 permit ${baseNetwork}.0.0 0.0.255.255
! Default Route
ip route 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0
exit`;
        
        let coreConfig = `! Core L3 Switch (3650-24PS) Configuration
enable\nconf t\nhostname Core-L3-SW\n${securityCommands}ip routing\n`;
        vlans.forEach(v => {
            coreConfig += `vlan ${v.vlanId}\n name ${v.name}\nexit\n`;
            coreConfig += `interface Vlan${v.vlanId}\n ip address ${v.gateway} 255.255.255.0\n no shutdown\n`;
        });
        coreConfig += `ip route 0.0.0.0 0.0.0.0 ${baseNetwork}.1.254\n`;
        configs['Core-L3-SW'] = coreConfig;

    } else { // SOHO
        const lan = vlans[0];
        configs['SOHO-RTR'] = `! SOHO Router (1941 ISR) Configuration
enable
conf t
hostname SOHO-RTR
${securityCommands}
! WAN Interface
interface GigabitEthernet0/0
 ip address dhcp
 ip nat outside
 no shutdown
! LAN Interface
interface GigabitEthernet0/1
 ip address ${lan.gateway} 255.255.255.0
 ip nat inside
 no shutdown
! DHCP Pool
ip dhcp pool SOHO_LAN
 network ${lan.subnet}
 default-router ${lan.gateway}
 dns-server 8.8.8.8
! NAT Overload
ip nat inside source list 1 interface GigabitEthernet0/0 overload
access-list 1 permit ${lan.subnet.slice(0,-2)}.0 0.0.0.255
exit`;
        configs['LAN-SW'] = `! LAN Switch (2960-24TT) Configuration
enable
conf t
hostname LAN-SW
${securityCommands}
vlan 1
 name LAN
exit`;
    }

    nodes.filter(n => n.type === 'switch' && n.id.startsWith('Access')).forEach(sw => {
        const vlan = vlans.find(v => v.vlanId === sw.vlan);
        let config = `! ${sw.label} Configuration
enable\nconf t\nhostname ${sw.label}\n${securityCommands}`;
        config += `vlan ${vlan.vlanId}\n name ${vlan.name}\nexit\n`;
        if (onPremServices.voip && design.tier !== 'SOHO') config += `vlan 70\n name VoIP\nexit\n`;
        config += `! Interface Configs\ninterface range FastEthernet0/1 - 24\n switchport mode access\n switchport access vlan ${vlan.vlanId}\n`;
        if (onPremServices.voip && design.tier !== 'SOHO') config += ` switchport voice vlan 70\n`;
        config += ` spanning-tree portfast\nexit\n`;
        config += `! Uplink Config\ninterface GigabitEthernet0/1\n switchport mode trunk\nexit\n`;
        configs[sw.label] = config;
    });
    
    return configs;
  }

  const generateCablingGuide = (links) => {
    return links.map(link => ({
        from: link.source,
        to: link.target,
        type: link.type === 'Fiber' ? 'Fiber Optic' : 'Copper Straight-Through'
    }));
  };

  const reset = () => {
    setStep(0);
    setNetworkDesign(null);
  }
  
  const Hero = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                
                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center overflow-hidden bg-black">
            <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full"></canvas>
            <div className="relative z-20 flex flex-col items-center p-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight font-mono" style={{ textShadow: '0 0 10px #0F0, 0 0 20px #0F0' }}>
                    LinkSync
                </h1>
                <p className="mt-4 text-lg md:text-xl text-green-300 max-w-2xl font-mono">
                    AI-Powered Cisco Network Topology Generator
                </p>
                <button 
                    onClick={() => setStep(0.5)} 
                    className="mt-12 w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-green-400 hover:bg-green-500/30 hover:text-white hover:shadow-[0_0_20px_#0F0] transition-all duration-300"
                    aria-label="Start Designing"
                >
                    <Power size={48} />
                </button>
            </div>
        </div>
    );
  }
  
  const renderStep = () => {
    switch (step) {
      case 0: return <Hero />;
      case 0.5: return <StepSelectDesign />;
      case 1: return <Step1Form />;
      case 2: return <Step2Form />;
      case 3: return <Step3Results />;
      default: return <Hero />;
    }
  };

  const StepSelectDesign = () => (
    <div className="text-center">
        <h2 className="text-3xl font-bold text-green-300 mb-2 font-mono">Choose Your Network Scale</h2>
        <p className="text-green-400/80 mb-8">Select a template that best fits your project requirements.</p>
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-left flex flex-col hover:border-green-400 transition-all">
                <Home className="mb-4 text-green-400" size={32}/>
                <h3 className="text-xl font-bold mb-2 text-green-300">SOHO</h3>
                <p className="text-sm text-green-400/80 mb-4 flex-grow">A simple, flat network for small offices or home labs. Features a single router and switch.</p>
                <Button variant="secondary" className="mt-4" onClick={() => { setDesignTier('soho'); setStep(1); }}>Select</Button>
            </Card>
            <Card className="text-left flex flex-col hover:border-green-400 transition-all">
                <Briefcase className="mb-4 text-green-400" size={32}/>
                <h3 className="text-xl font-bold mb-2 text-green-300">Standard Business</h3>
                <p className="text-sm text-green-400/80 mb-4 flex-grow">A robust design with VLANs, a Layer 3 switch for routing, and a dedicated DHCP server.</p>
                <Button variant="secondary" className="mt-4" onClick={() => { setDesignTier('standard'); setStep(1); }}>Select</Button>
            </Card>
            <Card className="text-left flex flex-col hover:border-green-400 transition-all">
                <Building className="mb-4 text-green-400" size={32}/>
                <h3 className="text-xl font-bold mb-2 text-green-300">Enterprise Grade</h3>
                <p className="text-sm text-green-400/80 mb-4 flex-grow">A high-availability architecture with dual-core switches, ASA firewall, HSRP, and OSPF.</p>
                <Button variant="secondary" className="mt-4" onClick={() => { setDesignTier('enterprise'); setStep(1); }}>Select</Button>
            </Card>
        </div>
    </div>
  );


  const Step1Form = () => (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/20"><Building className="text-green-400" /></div>
        <h2 className="text-2xl font-bold text-green-200">Office Details</h2>
      </div>
      <Input
        label="Number of Floors"
        type="number"
        value={numFloors}
        onChange={(e) => setNumFloors(Math.max(1, parseInt(e.target.value) || 1))}
        placeholder="e.g., 3"
        icon={<Building size={16} />}
      />
      <div className="mt-6">
        <label className="block text-sm font-medium text-green-300/70 mb-2">Departments & Employees</label>
        {departments.map((dept) => (
          <DepartmentInput 
            key={dept.id} 
            dept={dept}
            onUpdate={updateDepartment}
            onRemove={removeDepartment}
            canRemove={departments.length > 1}
          />
        ))}
        <button onClick={() => addDepartment()} className="text-green-400 hover:text-green-300 text-sm mt-2 font-semibold">+ Add Department</button>
      </div>
       <p className="text-sm text-green-200/60 mt-4 text-right">Total Employees: {totalEmployees}</p>
      <Button onClick={() => setStep(2)} disabled={!isStep1Valid()} className="mt-6">
        Next <ArrowRight size={18} />
      </Button>
    </Card>
  );

  const Step2Form = () => (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/20"><Server className="text-green-400" /></div>
        <h2 className="text-2xl font-bold text-green-200">Servers & Services</h2>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-200 mb-3">On-Premise Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(onPremServices).map(serverKey => (
            <label key={serverKey} className="flex items-center gap-3 bg-black/30 p-3 rounded-lg cursor-pointer border border-green-800/20">
              <input
                type="checkbox"
                checked={onPremServices[serverKey]}
                onChange={(e) => setOnPremServices({ ...onPremServices, [serverKey]: e.target.checked })}
                className="form-checkbox h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="capitalize text-green-200">{serverKey === 'voip' ? 'VoIP (CME)' : `${serverKey} Server`}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-green-200 mb-3">Cloud Services (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(cloudServices).map(serviceKey => (
            <label key={serviceKey} className="flex items-center gap-3 bg-black/30 p-3 rounded-lg cursor-pointer border border-green-800/20">
              <input
                type="checkbox"
                checked={cloudServices[serviceKey]}
                onChange={(e) => setCloudServices({ ...cloudServices, [serviceKey]: e.target.checked })}
                className="form-checkbox h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="uppercase text-green-200">{serviceKey}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button onClick={() => setStep(1)} variant="secondary">Back</Button>
        <Button onClick={generateNetworkDesign}>
          Generate Network Design <ArrowRight size={18} />
        </Button>
      </div>
    </Card>
  );

  const ConfigCard = ({ title, content }) => {
      const [copied, setCopied] = useState(false);
      const copyToClipboard = (text) => {
          const el = document.createElement('textarea');
          el.value = text;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      };
      
      return (
          <div className="mb-4 bg-black/30 border border-green-800/20 rounded-lg">
             <div className="p-4">
                 <h4 className="font-semibold text-lg text-green-400 flex items-center gap-3"><HardDrive size={20}/>{title}</h4>
                 <div className="relative mt-2">
                     <pre className="text-sm text-green-300 whitespace-pre-wrap p-4 bg-black/50 rounded-md overflow-x-auto font-mono">
                         <code>{content}</code>
                     </pre>
                     <button 
                        onClick={() => copyToClipboard(content)} 
                        className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 text-gray-300 flex items-center gap-1 text-xs"
                     >
                         {copied ? <><Check size={14}/> Copied!</> : <><Clipboard size={14}/> Copy</>}
                     </button>
                 </div>
             </div>
          </div>
      );
  };

  const Step3Results = () => {
      if (!networkDesign) return null;
      
      const handleMouseDown = (e, node) => {
          const CTM = svgRef.current.getScreenCTM();
          const mouseX = (e.clientX - CTM.e) / CTM.a;
          const mouseY = (e.clientY - CTM.f) / CTM.d;
          setDraggingNode(node.id);
          setOffset({ x: mouseX - node.x, y: mouseY - node.y });
      };

      const handleMouseMove = (e) => {
          if (draggingNode) {
              const CTM = svgRef.current.getScreenCTM();
              const mouseX = (e.clientX - CTM.e) / CTM.a;
              const mouseY = (e.clientY - CTM.f) / CTM.d;
              setNodes(nodes.map(n => 
                  n.id === draggingNode ? { ...n, x: mouseX - offset.x, y: mouseY - offset.y } : n
              ));
          }
          setTooltipPos({ x: e.clientX, y: e.clientY });
      };

      const handleMouseUp = () => {
          setDraggingNode(null);
      };

      const handleMouseLeave = () => {
          setDraggingNode(null);
          setHoveredNode(null);
      };
      
      const getDeviceModel = (nodeType) => {
        const { devices } = networkDesign;
        switch (nodeType) {
            case 'firewall': return devices.firewall.name;
            case 'mlswitch': return devices.coreSwitch.name;
            case 'switch': return devices.accessSwitch.name;
            case 'router': return onPremServices.voip ? devices.voipGateway.name : devices.router.name;
            case 'server': return 'Generic Server';
            case 'pc': return 'PC-PT';
            case 'laptop': return 'Laptop-PT';
            case 'ipphone': return '7960 IP Phone';
            case 'printer': return 'Printer-PT';
            default: return 'Device';
        }
      };

      const DeviceIcon = ({type, width, height, className}) => {
          const iconMap = {
            router: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M20.29 10.29l-3.58 3.58a.996.996 0 0 1-1.41 0l-2.59-2.59a.996.996 0 0 1 0-1.41l2.59-2.59a.996.996 0 0 1 1.41 0l3.58 3.58c.39.39.39 1.03 0 1.42zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path fill="currentColor" d="M7.29 13.71l-3.58-3.58a.996.996 0 0 1 0-1.41l3.58-3.58a.996.996 0 0 1 1.41 0l2.59 2.59c.39.39.39 1.02 0 1.41l-2.59 2.59a.996.996 0 0 1-1.41 0z"/></svg>,
            mlswitch: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M19 8h-4.26l-1.12 2.24a2 2 0 0 1-1.79 1.11h-.1a2 2 0 0 1-1.79-1.11L8.26 8H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm-7 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/><path fill="currentColor" d="M12 14c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/></svg>,
            switch: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M15 21h-2v-2h2v2zm-4 0h-2v-2h2v2zm8 0h-2v-2h2v2zm-8-8h-2v-2h2v2zm4 0h-2v-2h2v2zM7 5h10v2H7zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>,
            server: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M20 15v-2c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2v2h2v2h16v-2h2v-2h-2zm-2-2h-4v-2h4v2zM6 15h4v-2H6v2z"/></svg>,
            pc: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>,
            laptop: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M20 18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 7h16v9H4V7z"/></svg>,
            printer: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM18 3H6v4h12V3z"/></svg>,
            ipphone: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m10.92 0h1.51c-.09 1.32-.35 2.59-.76 3.79l-1.2-1.2c.24-.83.39-1.7.45-2.59M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z"/></svg>,
            firewall: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>,
            cloud: <svg width={width} height={height} className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>,
          };
          return iconMap[type] || <div/>;
      }
      
      const CostEstimation = () => {
        const deviceCosts = {
            '1941 ISR': 25000, '2960-24TT': 6000, '4321 ISR': 38000, '3650-24PS': 35000, 'ASA 5506-X': 30000, '2911 Router': 25000,
        };
        
        let hardwareCost = 0;
        let installRate = 0;

        const numAccessSwitches = nodes.filter(n => n.type === 'switch').length;

        if (networkDesign.tier === 'SOHO') {
            hardwareCost = deviceCosts['1941 ISR'] + deviceCosts['2960-24TT'];
            installRate = 0.20;
        } else if (networkDesign.tier === 'Standard Business') {
            hardwareCost = deviceCosts['4321 ISR'] + deviceCosts['3650-24PS'] + (numAccessSwitches * deviceCosts['2960-24TT']);
            installRate = 0.25;
        } else { // enterprise
            hardwareCost = deviceCosts['ASA 5506-X'] + (2 * deviceCosts['3650-24PS']) + (numAccessSwitches * deviceCosts['2960-24TT']) + (onPremServices.voip ? deviceCosts['2911 Router'] : 0);
            installRate = 0.30;
        }
        
        const installationCost = hardwareCost * installRate;
        const total = hardwareCost + installationCost;
        
        const formatCurrency = (num) => `₹${num.toLocaleString('en-IN')}`;

        return (
            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-3"><IndianRupee/>Project Cost Estimation</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-green-400/80">Hardware Cost</p>
                        <p className="text-2xl font-bold text-green-200">{formatCurrency(hardwareCost)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-green-400/80">Cabling & Installation</p>
                        <p className="text-2xl font-bold text-green-200">{formatCurrency(installationCost)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-green-400/80">Total Estimated Cost</p>
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">{formatCurrency(total)}</p>
                    </div>
                </div>
            </Card>
        );
      };

      return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-green-200">Your {networkDesign.tier} Network Design</h2>
                        <p className="text-green-300/70 mt-1">A secure, redundant, and scalable topology for {totalEmployees} employees.</p>
                    </div>
                    <Button onClick={reset} variant="secondary" className="w-full mt-4 sm:w-auto sm:mt-0">Start Over</Button>
                </div>
            </Card>

            <CostEstimation />
            
            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4">Network IP Plan</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-green-300">
                        <thead className="bg-black/50 text-xs uppercase text-green-400/80">
                            <tr>
                                <th className="px-4 py-2">VLAN ID</th>
                                <th className="px-4 py-2">VLAN Name</th>
                                <th className="px-4 py-2">Subnet / Mask</th>
                                <th className="px-4 py-2">Gateway</th>
                                <th className="px-4 py-2">DHCP Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            {networkDesign.ipSchema.vlans.map((vlan) => (
                                <tr key={vlan.vlanId} className="border-b border-green-800/20">
                                    <td className="px-4 py-2 font-medium">{vlan.vlanId}</td>
                                    <td className="px-4 py-2">{vlan.name.replace(/_/g, ' ')}</td>
                                    <td className="px-4 py-2">{vlan.subnet}</td>
                                    <td className="px-4 py-2">{vlan.gateway}</td>
                                    <td className="px-4 py-2">{vlan.dhcp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-3"><Share2/>Interactive Topology Diagram</h3>
                <div className="w-full overflow-x-auto bg-black/50 border border-green-500/30 rounded-lg p-2 relative">
                    {hoveredNode && (
                        <div className="absolute p-2 text-xs bg-gray-800 text-white rounded-md pointer-events-none" style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}>
                            <p className="font-bold">{hoveredNode.label}</p>
                            <p>{getDeviceModel(hoveredNode.type)}</p>
                        </div>
                    )}
                    <svg ref={svgRef} width={networkDesign.topology.width} height={networkDesign.topology.height} className={`min-w-[${networkDesign.topology.width}px] text-green-400 ${draggingNode ? 'cursor-grabbing' : ''}`} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
                        {links.map((link, i) => {
                            const sourceNode = nodes.find(n => n.id === link.source);
                            const targetNode = nodes.find(n => n.id === link.target);
                            if (!sourceNode || !targetNode) return null;
                            return <line key={i} x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} className="stroke-current text-green-500/40" strokeWidth="1.5" />;
                        })}
                        {nodes.map(node => {
                            const isEndDevice = ['pc', 'laptop', 'printer', 'ipphone'].includes(node.type);
                            let iconSize = isEndDevice ? 24 : 32;
                            if (node.type === 'cloud') iconSize = 48;
                            
                            return (
                                <g 
                                    key={node.id} 
                                    transform={`translate(${node.x - iconSize/2}, ${node.y - iconSize/2})`}
                                    onMouseDown={(e) => handleMouseDown(e, node)}
                                    onMouseEnter={() => setHoveredNode(node)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    className="cursor-grab hover:opacity-80 transition-opacity"
                                >
                                    <DeviceIcon type={node.type} width={iconSize} height={iconSize} className="text-green-400"/>
                                    <text textAnchor="middle" x={iconSize/2} y={iconSize + 12} className="fill-current text-green-200 pointer-events-none" fontSize={isEndDevice ? 10 : 12} fontWeight="600">{node.label}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4">Cabling Guide</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-green-300">
                        <thead className="bg-black/50 text-xs uppercase text-green-400/80">
                            <tr>
                                <th className="px-4 py-2">From Device</th>
                                <th className="px-4 py-2">To Device</th>
                                <th className="px-4 py-2">Cable Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {networkDesign.cablingGuide.map((cable, i) => (
                                <tr key={i} className="border-b border-green-800/20">
                                    <td className="px-4 py-2 font-medium">{cable.from}</td>
                                    <td className="px-4 py-2 font-medium">{cable.to}</td>
                                    <td className="px-4 py-2">{cable.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4">End-Device Setup</h3>
                 <p className="text-green-400/80 mb-4">Configure the end-user devices in each department's LAN as follows:</p>
                 <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg text-green-400 flex items-center gap-2"><Laptop size={20}/> PCs & Laptops</h4>
                        <p>Go to `Desktop` &gt; `IP Configuration` and select **DHCP**. The device will automatically receive an IP address from its VLAN.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-green-400 flex items-center gap-2"><PrinterIcon size={20}/> Printers</h4>
                        <p>Printers should have static IPs for reliability. Go to `Desktop` &gt; `IP Configuration`. Select **Static** and assign an IP address from the department's subnet that is outside the DHCP range (e.g., x.x.x.250).</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-green-400 flex items-center gap-2"><Phone size={20}/> IP Phones</h4>
                        <p>IP Phones require no IP configuration. They are powered by the switch (PoE) and will automatically register with the Voice Gateway (CME) and receive an extension.</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-lg text-green-400 flex items-center gap-2"><Smartphone size={20}/> Wireless Devices</h4>
                        <p>For Tablets and Smartphones, go to `Desktop` &gt; `Wireless`. Connect to the appropriate SSID (e.g., "EMPLOYEE_WIFI") and configure WPA2 security with the appropriate credentials.</p>
                    </div>
                 </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-green-300 mb-4">Infrastructure Device Configurations</h3>
                {Object.entries(networkDesign.configs).map(([deviceName, configContent]) => (
                    <ConfigCard key={deviceName} title={deviceName.replace(/_/g, ' ')} content={configContent}/>
                ))}
            </Card>
        </div>
      );
  }

  return (
    <div className="bg-black text-green-300 min-h-screen font-mono">
      <div className="relative container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default App;
