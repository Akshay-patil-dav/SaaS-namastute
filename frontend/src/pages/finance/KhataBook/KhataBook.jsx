import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient, { API } from '../../../api/config';
import { useCurrency } from '../../../hooks/useCurrency';
import { useCompany } from '../../../context/CompanyContext';
import { useSettings } from '../../../hooks/useSettings';
import {
    BookOpen,
    Users,
    Truck,
    Calendar,
    Plus,
    Search,
    Phone,
    Mail,
    MapPin,
    ArrowDownRight,
    ArrowUpLeft,
    Share2,
    Printer,
    Trash2,
    Edit,
    RotateCcw,
    X,
    Filter,
    CheckCircle2,
    AlertCircle,
    Download,
    CreditCard,
    DollarSign,
    Sparkles,
    Send,
    MessageSquare,
    ExternalLink,
    RefreshCw,
    Zap
} from 'lucide-react';
import { sendWhatsAppMessage, formatWhatsAppPhone } from '../../../services/whatsappService';
import './KhataBook.css';

// ── Initial Mock Data for graceful offline fallback ───────────────────────────
const INITIAL_DEMO_PARTIES = [
    {
        id: 101,
        name: 'Sharma Kirana Store (Ramesh)',
        phone: '9876543210',
        email: 'ramesh.sharma@example.com',
        address: 'Main Bazaar, Sector 4',
        partyType: 'CUSTOMER',
        openingBalance: 2500,
        openingBalanceType: 'YOU_WILL_GET',
        netBalance: 4200,
        updatedAt: new Date().toISOString()
    },
    {
        id: 102,
        name: 'Pooja Enterprises',
        phone: '9812345678',
        email: 'pooja@enterprises.in',
        address: 'Shop 12, Gandhi Road',
        partyType: 'CUSTOMER',
        openingBalance: 0,
        openingBalanceType: 'YOU_WILL_GET',
        netBalance: 1850,
        updatedAt: new Date().toISOString()
    },
    {
        id: 103,
        name: 'Amit Patel',
        phone: '9922334455',
        email: 'amit.patel@gmail.com',
        address: 'A-204, Green Heights',
        partyType: 'CUSTOMER',
        openingBalance: 1200,
        openingBalanceType: 'YOU_WILL_GET',
        netBalance: 0,
        updatedAt: new Date().toISOString()
    },
    {
        id: 201,
        name: 'Balaji Packaging Suppliers',
        phone: '9845012345',
        email: 'sales@balajipack.com',
        address: 'Plot 45, Industrial Area Phase 2',
        partyType: 'SUPPLIER',
        openingBalance: 5000,
        openingBalanceType: 'YOU_WILL_GIVE',
        netBalance: -3500,
        updatedAt: new Date().toISOString()
    },
    {
        id: 202,
        name: 'Hindustan Dairy & Provisions',
        phone: '9765432109',
        email: 'hindustan.dairy@supply.com',
        address: 'Wholesale Mandi, Gate 3',
        partyType: 'SUPPLIER',
        openingBalance: 2000,
        openingBalanceType: 'YOU_WILL_GIVE',
        netBalance: -1200,
        updatedAt: new Date().toISOString()
    }
];

const INITIAL_DEMO_TRANSACTIONS = [
    {
        id: 1001,
        partyId: 101,
        partyName: 'Sharma Kirana Store (Ramesh)',
        partyType: 'CUSTOMER',
        transactionType: 'GAVE',
        amount: 2500,
        paymentMode: 'CASH',
        referenceNumber: 'INV-4091',
        notes: 'Grocery items on 15-day credit',
        transactionDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        runningBalance: 2500,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
        id: 1002,
        partyId: 101,
        partyName: 'Sharma Kirana Store (Ramesh)',
        partyType: 'CUSTOMER',
        transactionType: 'GAVE',
        amount: 2200,
        paymentMode: 'CASH',
        referenceNumber: 'INV-4120',
        notes: 'Oil & dry fruits batch',
        transactionDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        runningBalance: 4700,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
        id: 1003,
        partyId: 101,
        partyName: 'Sharma Kirana Store (Ramesh)',
        partyType: 'CUSTOMER',
        transactionType: 'GOT',
        amount: 500,
        paymentMode: 'UPI',
        referenceNumber: 'UPI-7890123',
        notes: 'GPay partial payment received',
        transactionDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        runningBalance: 4200,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
        id: 1004,
        partyId: 102,
        partyName: 'Pooja Enterprises',
        partyType: 'CUSTOMER',
        transactionType: 'GAVE',
        amount: 1850,
        paymentMode: 'CASH',
        referenceNumber: 'BILL-9902',
        notes: 'Counter goods',
        transactionDate: new Date().toISOString().split('T')[0],
        runningBalance: 1850,
        createdAt: new Date().toISOString()
    },
    {
        id: 2001,
        partyId: 201,
        partyName: 'Balaji Packaging Suppliers',
        partyType: 'SUPPLIER',
        transactionType: 'GOT',
        amount: 5000,
        paymentMode: 'BANK_TRANSFER',
        referenceNumber: 'PUR-819',
        notes: 'Corrugated cartons delivery',
        transactionDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        runningBalance: -5000,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
        id: 2002,
        partyId: 201,
        partyName: 'Balaji Packaging Suppliers',
        partyType: 'SUPPLIER',
        transactionType: 'GAVE',
        amount: 1500,
        paymentMode: 'UPI',
        referenceNumber: 'UPI-449102',
        notes: 'Advance part payment via PhonePe',
        transactionDate: new Date().toISOString().split('T')[0],
        runningBalance: -3500,
        createdAt: new Date().toISOString()
    }
];

export default function KhataBook() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { formatCurrency, currencySymbol } = useCurrency();
    const { companyInfo } = useCompany();
    const { settings } = useSettings();

    // Active tab from URL query param or state: 'customers' | 'suppliers' | 'daybook'
    const activeTabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(
        activeTabParam === 'suppliers' ? 'suppliers' : activeTabParam === 'daybook' ? 'daybook' : 'customers'
    );

    useEffect(() => {
        if (activeTabParam && ['customers', 'suppliers', 'daybook'].includes(activeTabParam)) {
            setActiveTab(activeTabParam);
        }
    }, [activeTabParam]);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setSearchParams({ tab: tabKey });
    };

    // State
    const [parties, setParties] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedParty, setSelectedParty] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'SETTLED'
    const [daybookDate, setDaybookDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
    const [editingParty, setEditingParty] = useState(null);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txType, setTxType] = useState('GAVE'); // 'GAVE' or 'GOT'
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    // Dynamic WhatsApp Messenger Modal States
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isWaModalOpen, setIsWaModalOpen] = useState(false);
    const [waParty, setWaParty] = useState(null);
    const [waPhone, setWaPhone] = useState('');
    const [waMessageType, setWaMessageType] = useState('reminder'); // 'reminder' | 'statement' | 'custom'
    const [waIncludeUpi, setWaIncludeUpi] = useState(true);
    const [waCustomMessage, setWaCustomMessage] = useState('');
    const [waSending, setWaSending] = useState(false);
    const [waStatus, setWaStatus] = useState(null);
    const [sendTxWhatsApp, setSendTxWhatsApp] = useState(true);
    const [khataToast, setKhataToast] = useState(null);

    const showKhataToast = (msg) => {
        setKhataToast(msg);
        setTimeout(() => setKhataToast(null), 5000);
    };

    // Form inputs: Party
    const [partyForm, setPartyForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        partyType: 'CUSTOMER',
        openingBalance: '',
        openingBalanceType: 'YOU_WILL_GET'
    });

    // Form inputs: Transaction
    const [txForm, setTxForm] = useState({
        amount: '',
        paymentMode: 'CASH',
        referenceNumber: '',
        notes: '',
        transactionDate: new Date().toISOString().split('T')[0]
    });

    // ── Load Data ─────────────────────────────────────────────────────────────
    const loadData = async () => {
        setLoading(true);
        try {
            // Attempt to fetch from backend
            apiClient.get('/bank-accounts').then(r => setBankAccounts(r.data || [])).catch(() => {});
            const [partiesRes, daybookRes] = await Promise.all([
                apiClient.get('/khata/parties'),
                apiClient.get('/khata/daybook')
            ]);

            if (partiesRes.data && Array.isArray(partiesRes.data) && partiesRes.data.length > 0) {
                setParties(partiesRes.data);
                localStorage.setItem('namustutam_khata_parties', JSON.stringify(partiesRes.data));
            } else {
                throw new Error('Empty backend data, use cached/fallback');
            }

            if (daybookRes.data && Array.isArray(daybookRes.data)) {
                setTransactions(daybookRes.data);
                localStorage.setItem('namustutam_khata_transactions', JSON.stringify(daybookRes.data));
            }
        } catch (err) {
            // Graceful fallback to localStorage cache or initial demo dataset
            const cachedParties = localStorage.getItem('namustutam_khata_parties');
            const cachedTxs = localStorage.getItem('namustutam_khata_transactions');

            if (cachedParties) {
                try {
                    setParties(JSON.parse(cachedParties));
                } catch {
                    setParties(INITIAL_DEMO_PARTIES);
                }
            } else {
                setParties(INITIAL_DEMO_PARTIES);
                localStorage.setItem('namustutam_khata_parties', JSON.stringify(INITIAL_DEMO_PARTIES));
            }

            if (cachedTxs) {
                try {
                    setTransactions(JSON.parse(cachedTxs));
                } catch {
                    setTransactions(INITIAL_DEMO_TRANSACTIONS);
                }
            } else {
                setTransactions(INITIAL_DEMO_TRANSACTIONS);
                localStorage.setItem('namustutam_khata_transactions', JSON.stringify(INITIAL_DEMO_TRANSACTIONS));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Select default party when parties load or tab changes
    useEffect(() => {
        if (!selectedParty && parties.length > 0) {
            const currentType = activeTab === 'suppliers' ? 'SUPPLIER' : 'CUSTOMER';
            const firstOfType = parties.find(p => p.partyType === currentType);
            if (firstOfType) setSelectedParty(firstOfType);
        }
    }, [parties, activeTab, selectedParty]);

    // When tab changes, re-pick an appropriate party
    const handleSelectTab = (tabKey) => {
        handleTabChange(tabKey);
        const currentType = tabKey === 'suppliers' ? 'SUPPLIER' : 'CUSTOMER';
        const first = parties.find(p => p.partyType === currentType);
        if (first) {
            setSelectedParty(first);
        } else {
            setSelectedParty(null);
        }
    };

    // ── Metrics Calculation ───────────────────────────────────────────────────
    const summaryMetrics = useMemo(() => {
        let totalYouWillGet = 0;
        let totalYouWillGive = 0;
        let customerCount = 0;
        let supplierCount = 0;

        parties.forEach(p => {
            const bal = Number(p.netBalance || 0);
            if (p.partyType === 'CUSTOMER') customerCount++;
            if (p.partyType === 'SUPPLIER') supplierCount++;

            if (bal > 0) {
                totalYouWillGet += bal;
            } else if (bal < 0) {
                totalYouWillGive += Math.abs(bal);
            }
        });

        // Today's flow
        const todayStr = new Date().toISOString().split('T')[0];
        const todayTxs = transactions.filter(t => t.transactionDate === todayStr);
        let todayGiven = 0;
        let todayGot = 0;

        todayTxs.forEach(t => {
            const amt = Number(t.amount || 0);
            if (t.transactionType === 'GAVE') {
                todayGiven += amt;
            } else {
                todayGot += amt;
            }
        });

        return {
            totalYouWillGet,
            totalYouWillGive,
            netBalance: totalYouWillGet - totalYouWillGive,
            customerCount,
            supplierCount,
            todayGiven,
            todayGot,
            todayCount: todayTxs.length
        };
    }, [parties, transactions]);

    // ── Filtered Parties ──────────────────────────────────────────────────────
    const filteredParties = useMemo(() => {
        const targetType = activeTab === 'suppliers' ? 'SUPPLIER' : 'CUSTOMER';
        return parties.filter(p => {
            if (p.partyType !== targetType) return false;

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = (p.name || '').toLowerCase().includes(q);
                const matchesPhone = (p.phone || '').includes(q);
                if (!matchesName && !matchesPhone) return false;
            }

            const bal = Number(p.netBalance || 0);
            if (filterStatus === 'PENDING') {
                return bal !== 0;
            }
            if (filterStatus === 'SETTLED') {
                return bal === 0;
            }
            return true;
        });
    }, [parties, activeTab, searchQuery, filterStatus]);

    // ── Selected Party Transactions ───────────────────────────────────────────
    const activePartyTransactions = useMemo(() => {
        if (!selectedParty) return [];
        return transactions
            .filter(t => Number(t.partyId) === Number(selectedParty.id))
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate) || b.id - a.id);
    }, [selectedParty, transactions]);

    // ── Daybook Transactions ──────────────────────────────────────────────────
    const daybookTransactions = useMemo(() => {
        return transactions
            .filter(t => t.transactionDate === daybookDate)
            .sort((a, b) => new Date(b.createdAt || b.transactionDate) - new Date(a.createdAt || a.transactionDate));
    }, [transactions, daybookDate]);

    // ── Handlers: Party ───────────────────────────────────────────────────────
    const openAddPartyModal = () => {
        setEditingParty(null);
        setPartyForm({
            name: '',
            phone: '',
            email: '',
            address: '',
            partyType: activeTab === 'suppliers' ? 'SUPPLIER' : 'CUSTOMER',
            openingBalance: '',
            openingBalanceType: activeTab === 'suppliers' ? 'YOU_WILL_GIVE' : 'YOU_WILL_GET'
        });
        setIsPartyModalOpen(true);
    };

    const openEditPartyModal = (party) => {
        setEditingParty(party);
        setPartyForm({
            name: party.name || '',
            phone: party.phone || '',
            email: party.email || '',
            address: party.address || '',
            partyType: party.partyType || 'CUSTOMER',
            openingBalance: party.openingBalance || '',
            openingBalanceType: party.openingBalanceType || 'YOU_WILL_GET'
        });
        setIsPartyModalOpen(true);
    };

    const handleSaveParty = async (e) => {
        e.preventDefault();
        if (!partyForm.name.trim()) {
            alert('Please enter party name');
            return;
        }

        const openingAmt = parseFloat(partyForm.openingBalance) || 0;
        const initialNet = partyForm.openingBalanceType === 'YOU_WILL_GIVE' ? -openingAmt : openingAmt;

        if (editingParty) {
            // Update existing
            try {
                await apiClient.put(`/khata/parties/${editingParty.id}`, partyForm);
            } catch {
                // local update
            }
            const updated = parties.map(p =>
                p.id === editingParty.id
                    ? { ...p, ...partyForm }
                    : p
            );
            setParties(updated);
            localStorage.setItem('namustutam_khata_parties', JSON.stringify(updated));
            if (selectedParty?.id === editingParty.id) {
                setSelectedParty(prev => ({ ...prev, ...partyForm }));
            }
        } else {
            // Create new
            const newParty = {
                id: Date.now(),
                ...partyForm,
                openingBalance: openingAmt,
                netBalance: initialNet,
                updatedAt: new Date().toISOString()
            };

            try {
                const res = await apiClient.post('/khata/parties', partyForm);
                if (res.data && res.data.id) {
                    newParty.id = res.data.id;
                }
            } catch {
                // saved locally
            }

            const updated = [newParty, ...parties];
            setParties(updated);
            localStorage.setItem('namustutam_khata_parties', JSON.stringify(updated));
            setSelectedParty(newParty);
        }

        setIsPartyModalOpen(false);
    };

    const handleDeleteParty = async (party) => {
        if (!window.confirm(`Are you sure you want to delete "${party.name}" and all their ledger transactions? This cannot be undone.`)) {
            return;
        }

        try {
            await apiClient.delete(`/khata/parties/${party.id}`);
        } catch {
            // delete locally
        }

        const updatedParties = parties.filter(p => p.id !== party.id);
        const updatedTxs = transactions.filter(t => Number(t.partyId) !== Number(party.id));

        setParties(updatedParties);
        setTransactions(updatedTxs);
        localStorage.setItem('namustutam_khata_parties', JSON.stringify(updatedParties));
        localStorage.setItem('namustutam_khata_transactions', JSON.stringify(updatedTxs));

        if (selectedParty?.id === party.id) {
            const nextParty = updatedParties.find(p => p.partyType === party.partyType) || null;
            setSelectedParty(nextParty);
        }
    };

    // ── Handlers: Transactions ────────────────────────────────────────────────
    const openAddTxModal = (type) => {
        if (!selectedParty) {
            alert('Please select a party first.');
            return;
        }
        setTxType(type);
        setSendTxWhatsApp(true);
        setTxForm({
            amount: '',
            paymentMode: 'CASH',
            referenceNumber: '',
            notes: '',
            transactionDate: new Date().toISOString().split('T')[0]
        });
        setIsTxModalOpen(true);
    };

    const handleSaveTransaction = async (e) => {
        e.preventDefault();
        const amt = parseFloat(txForm.amount);
        if (!amt || amt <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        // Net balance update:
        // GAVE: You gave (Udhar Diya / Debit) -> +amt
        // GOT:  You got  (Jama Kiya / Credit)  -> -amt
        const currentBal = Number(selectedParty.netBalance || 0);
        const newBal = txType === 'GAVE' ? currentBal + amt : currentBal - amt;

        const newTx = {
            id: Date.now(),
            partyId: selectedParty.id,
            partyName: selectedParty.name,
            partyType: selectedParty.partyType,
            transactionType: txType,
            amount: amt,
            paymentMode: txForm.paymentMode,
            referenceNumber: txForm.referenceNumber,
            notes: txForm.notes,
            transactionDate: txForm.transactionDate,
            runningBalance: newBal,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await apiClient.post('/khata/transactions', {
                ...txForm,
                partyId: selectedParty.id,
                transactionType: txType,
                amount: amt
            });
            if (res.data && res.data.id) {
                newTx.id = res.data.id;
            }
        } catch {
            // Local fallback
        }

        // Update transactions
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('namustutam_khata_transactions', JSON.stringify(updatedTxs));

        // Update party balance
        const updatedParties = parties.map(p =>
            p.id === selectedParty.id
                ? { ...p, netBalance: newBal, updatedAt: new Date().toISOString() }
                : p
        );
        setParties(updatedParties);
        localStorage.setItem('namustutam_khata_parties', JSON.stringify(updatedParties));
        setSelectedParty(prev => ({ ...prev, netBalance: newBal }));

        setIsTxModalOpen(false);

        // Auto WhatsApp notification if checked and phone available
        if (sendTxWhatsApp && selectedParty.phone) {
            const defaultCode = settings?.whatsappCountryCode || '91';
            const cleanPhone = formatWhatsAppPhone(selectedParty.phone, defaultCode);
            const bizName = companyInfo?.name || settings?.companyName || 'Namustutam Store';
            const actionText = txType === 'GAVE' ? 'Given (Debit / Udhar)' : 'Received (Credit / Jama)';
            const balSummary = newBal > 0 
                ? `${formatCurrency(Math.abs(newBal))} (You'll Get)` 
                : newBal < 0 
                    ? `${formatCurrency(Math.abs(newBal))} (Advance Deposit)` 
                    : 'Account Fully Settled (Nil)';

            let upiPart = '';
            if (newBal > 0) {
                const primaryBank = bankAccounts[0];
                const upiId = primaryBank
                    ? `${primaryBank.accountNumber}@${primaryBank.branchIfsc}.ifsc.npci`
                    : (settings?.upiId || 'namastute.pay@upi');
                const numericAmt = Math.abs(newBal).toFixed(2);
                const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(bizName)}&am=${numericAmt}&cu=INR&tn=${encodeURIComponent(`Khata ${selectedParty.name}`)}`;
                upiPart = `\n\n📲 *Pay Online via UPI (GPay/PhonePe):*\n${upiUri}`;
            }

            const txMsg = 
`━━━━━━━━━━━━━━━━━━━━━━
📖 *KHATA ENTRY UPDATE*
🏪 *${bizName}*
━━━━━━━━━━━━━━━━━━━━━━

Namaste *${selectedParty.name}* ji,
A new transaction has been recorded in your Khata passbook:

💵 *Amount:* *${formatCurrency(amt)}* [${actionText}]
💳 *Payment Mode:* ${txForm.paymentMode}
📅 *Date:* ${txForm.transactionDate}
${txForm.referenceNumber ? `🔢 *Reference #:* ${txForm.referenceNumber}\n` : ''}${txForm.notes ? `📝 *Note:* ${txForm.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
📊 *UPDATED NET BALANCE:*
*${balSummary}*
━━━━━━━━━━━━━━━━━━━━━━${upiPart}

✨ _Thank you for doing business with us!_
🏪 *${bizName}*
━━━━━━━━━━━━━━━━━━━━━━`;

            const isBackgroundConfigured = settings?.whatsappBackgroundAutoSend === 'true' ||
                settings?.whatsappMode === 'cloud_api' ||
                settings?.whatsappMode === 'gateway' ||
                (settings?.whatsappPhoneId && settings?.whatsappToken) ||
                settings?.whatsappGatewayUrl;

            sendWhatsAppMessage({
                phone: cleanPhone,
                message: txMsg,
                settings,
                forceWeb: !isBackgroundConfigured
            }).then(res => {
                if (res.background) {
                    showKhataToast(`✓ WhatsApp entry update sent to ${selectedParty.name} in background!`);
                }
            }).catch(err => {
                console.warn('Khata transaction WhatsApp auto-send error:', err);
            });
        }
    };

    const handleDeleteTx = async (tx) => {
        if (!window.confirm(`Delete this ${formatCurrency(tx.amount)} transaction? Balance will be adjusted.`)) {
            return;
        }

        try {
            await apiClient.delete(`/khata/transactions/${tx.id}`);
        } catch {
            // Local delete
        }

        // Reverse balance change
        const reversedBal = tx.transactionType === 'GAVE'
            ? Number(selectedParty.netBalance || 0) - Number(tx.amount)
            : Number(selectedParty.netBalance || 0) + Number(tx.amount);

        const updatedTxs = transactions.filter(t => t.id !== tx.id);
        setTransactions(updatedTxs);
        localStorage.setItem('namustutam_khata_transactions', JSON.stringify(updatedTxs));

        const updatedParties = parties.map(p =>
            p.id === selectedParty.id
                ? { ...p, netBalance: reversedBal, updatedAt: new Date().toISOString() }
                : p
        );
        setParties(updatedParties);
        localStorage.setItem('namustutam_khata_parties', JSON.stringify(updatedParties));
        setSelectedParty(prev => ({ ...prev, netBalance: reversedBal }));
    };

    // ── Dynamic WhatsApp Messenger & Reminder Engine ────────────────────────
    const openWhatsAppModal = (party) => {
        const p = party || selectedParty;
        if (!p) return;
        setWaParty(p);
        setWaPhone(p.phone || '');
        setWaMessageType('reminder');
        setWaIncludeUpi(true);
        setWaCustomMessage('');
        setWaStatus(null);
        setIsWaModalOpen(true);
    };

    const sendWhatsAppReminder = (party) => {
        openWhatsAppModal(party);
    };

    const getCompiledKhataMessage = () => {
        if (!waParty) return '';
        const bal = Number(waParty.netBalance || 0);
        const absBal = formatCurrency(Math.abs(bal));
        const bizName = companyInfo?.name || settings?.companyName || 'Namustutam Store';
        const partyTxs = transactions.filter(t => Number(t.partyId) === Number(waParty.id)).slice(0, 4);

        let upiPart = '';
        if (waIncludeUpi && bal > 0) {
            const primaryBank = bankAccounts[0];
            const upiId = primaryBank
                ? `${primaryBank.accountNumber}@${primaryBank.branchIfsc}.ifsc.npci`
                : (settings?.upiId || 'namastute.pay@upi');
            const numericAmt = Math.abs(bal).toFixed(2);
            const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(bizName)}&am=${numericAmt}&cu=INR&tn=${encodeURIComponent(`Khata ${waParty.name}`)}`;
            upiPart = `\n\n📲 *Pay Online via UPI (GPay/PhonePe):*\n${upiUri}`;
        }

        if (waMessageType === 'custom' && waCustomMessage.trim()) {
            return waCustomMessage
                .replace(/{party_name}/g, waParty.name)
                .replace(/{customer_name}/g, waParty.name)
                .replace(/{store_name}/g, bizName)
                .replace(/{balance}/g, absBal)
                .replace(/{date}/g, new Date().toLocaleDateString()) + upiPart;
        }

        if (waMessageType === 'statement') {
            const txLines = partyTxs.map(t => {
                const isGave = t.transactionType === 'GAVE';
                const sign = isGave ? '(Debit / Given)' : '(Credit / Received)';
                return `• ${new Date(t.transactionDate || t.createdAt).toLocaleDateString()}: ${formatCurrency(t.amount)} ${sign} [${t.paymentMode || 'CASH'}]`;
            }).join('\n');

            return `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📋 *KHATA STATEMENT / PASSBOOK*\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `👤 *Account:* ${waParty.name} (${waParty.partyType})\n` +
                `📅 *As of:* ${new Date().toLocaleDateString()}\n` +
                `📊 *Current Net Balance:* *${bal > 0 ? `${absBal} (You'll Get / Due)` : bal < 0 ? `${absBal} (Advance Deposit)` : 'Settled (Nil)'}*\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📝 *RECENT TRANSACTIONS:*\n` +
                (txLines || '• No recent transactions') + `\n` +
                `━━━━━━━━━━━━━━━━━━━━━━` +
                upiPart +
                `\n\n✨ _Thank you for maintaining a clear account with us!_\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`;
        }

        // Default: Payment Reminder
        if (bal > 0) {
            return `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `🔔 *PAYMENT REMINDER*\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Namaste *${waParty.name}* ji,\n\n` +
                `This is a polite reminder regarding your pending balance with *${bizName}*.\n\n` +
                `💰 *Pending Due Balance:* *${absBal}*\n` +
                `📅 *Date:* ${new Date().toLocaleDateString()}\n\n` +
                `Kindly settle the outstanding payment at your earliest convenience.` +
                upiPart +
                `\n\n✨ _Thank you for your cooperation!_\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`;
        } else if (bal < 0) {
            return `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📋 *ACCOUNT BALANCE UPDATE*\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Namaste *${waParty.name}* ji,\n\n` +
                `Statement update from *${bizName}*:\n` +
                `An advance deposit of *${absBal}* is recorded in your account.\n\n` +
                `✨ _Thank you for your trusted partnership!_\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`;
        } else {
            return `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `✅ *ACCOUNT FULLY SETTLED*\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Namaste *${waParty.name}* ji,\n\n` +
                `Your Khata account with *${bizName}* is fully settled (*Nil balance*).\n\n` +
                `✨ _Thank you for doing business with us!_\n` +
                `🏪 *${bizName}*\n` +
                `━━━━━━━━━━━━━━━━━━━━━━`;
        }
    };

    const handleSendKhataWhatsApp = async (forceWeb = false) => {
        if (!waParty) return;
        const defaultCode = settings?.whatsappCountryCode || '91';
        let cleanPhone = formatWhatsAppPhone(waPhone, defaultCode);

        if (!cleanPhone) {
            setWaStatus({ type: 'error', text: 'Please enter a valid mobile number for recipient.' });
            return;
        }

        // Save updated phone to party if changed
        if (waParty.phone !== waPhone) {
            const updated = parties.map(p => p.id === waParty.id ? { ...p, phone: waPhone } : p);
            setParties(updated);
            localStorage.setItem('namustutam_khata_parties', JSON.stringify(updated));
            if (selectedParty?.id === waParty.id) {
                setSelectedParty(prev => ({ ...prev, phone: waPhone }));
            }
        }

        const message = getCompiledKhataMessage();
        const isBackgroundConfigured = settings?.whatsappBackgroundAutoSend === 'true' ||
            settings?.whatsappMode === 'cloud_api' ||
            settings?.whatsappMode === 'gateway' ||
            (settings?.whatsappPhoneId && settings?.whatsappToken) ||
            settings?.whatsappGatewayUrl;

        if (!forceWeb && isBackgroundConfigured) {
            setWaSending(true);
            setWaStatus(null);
            try {
                const res = await sendWhatsAppMessage({
                    phone: cleanPhone,
                    message,
                    settings,
                    forceWeb: false
                });

                if (res.background) {
                    setWaStatus({
                        type: 'success',
                        text: `Dispatched directly to +${res.phone} in background (Zero windows opened)!`
                    });
                    showKhataToast(`✓ WhatsApp reminder sent to ${waParty.name} in background!`);
                } else {
                    setWaStatus({
                        type: 'success',
                        text: `Dispatched to +${cleanPhone}!`
                    });
                }
            } catch (err) {
                setWaStatus({
                    type: 'error',
                    text: `Background dispatch error: ${err.message}`,
                    canFallback: true
                });
            } finally {
                setWaSending(false);
            }
        } else {
            sendWhatsAppMessage({
                phone: cleanPhone,
                message,
                settings,
                forceWeb: true
            });
            setWaStatus({
                type: 'success',
                text: `Opened WhatsApp Web for +${cleanPhone}!`
            });
            showKhataToast(`✓ Opened WhatsApp Web for ${waParty.name}`);
        }
    };

    // ── Quick Print Statement ─────────────────────────────────────────────────
    const handlePrintStatement = () => {
        window.print();
    };

    return (
        <div className="khata-container">
            {/* ── Top Header ───────────────────────────────────────────── */}
            <div className="khata-header no-print">
                <div className="khata-title-area">
                    <h1>
                        <span className="khata-icon-badge">
                            <BookOpen size={22} />
                        </span>
                        Khata Book
                    </h1>
                    <p>Track customer credit (Udhar), supplier payables & daily cashbook transactions.</p>
                </div>
                <div className="khata-header-actions">
                    <button
                        className="khata-btn khata-btn-secondary"
                        onClick={() => handleTabChange('daybook')}
                        title="View Today's Daybook"
                    >
                        <Calendar size={15} />
                        Day Book
                    </button>
                    <button
                        className="khata-btn khata-btn-primary"
                        onClick={openAddPartyModal}
                    >
                        <Plus size={16} />
                        {activeTab === 'suppliers' ? 'Add Supplier' : 'Add Customer'}
                    </button>
                </div>
            </div>

            {/* ── KPI Summary Cards ────────────────────────────────────── */}
            <div className="khata-kpi-grid no-print">
                <div className="khata-kpi-card kpi-get">
                    <div>
                        <div className="kpi-info-label">You'll Get (Udhar)</div>
                        <div className="kpi-value text-get">{formatCurrency(summaryMetrics.totalYouWillGet)}</div>
                        <div className="kpi-subtext">From {summaryMetrics.customerCount} customer accounts</div>
                    </div>
                    <div className="kpi-icon-wrap">
                        <ArrowDownRight size={26} />
                    </div>
                </div>

                <div className="khata-kpi-card kpi-give">
                    <div>
                        <div className="kpi-info-label">You'll Give (Payables)</div>
                        <div className="kpi-value text-give">{formatCurrency(summaryMetrics.totalYouWillGive)}</div>
                        <div className="kpi-subtext">To {summaryMetrics.supplierCount} supplier accounts</div>
                    </div>
                    <div className="kpi-icon-wrap">
                        <ArrowUpLeft size={26} />
                    </div>
                </div>

                <div className="khata-kpi-card kpi-net">
                    <div>
                        <div className="kpi-info-label">Net Ledger Position</div>
                        <div className="kpi-value text-net">
                            {summaryMetrics.netBalance >= 0 ? '+' : ''}
                            {formatCurrency(summaryMetrics.netBalance)}
                        </div>
                        <div className="kpi-subtext">
                            {summaryMetrics.netBalance >= 0 ? 'Net Receivable' : 'Net Payable'}
                        </div>
                    </div>
                    <div className="kpi-icon-wrap">
                        <DollarSign size={26} />
                    </div>
                </div>

                <div className="khata-kpi-card kpi-today">
                    <div>
                        <div className="kpi-info-label">Today's Cash Flow</div>
                        <div className="kpi-value text-today">
                            Got: {formatCurrency(summaryMetrics.todayGot)}
                        </div>
                        <div className="kpi-subtext">Gave: {formatCurrency(summaryMetrics.todayGiven)} ({summaryMetrics.todayCount} entries)</div>
                    </div>
                    <div className="kpi-icon-wrap">
                        <Calendar size={26} />
                    </div>
                </div>
            </div>

            {/* ── Tabs Bar ─────────────────────────────────────────────── */}
            <div className="khata-tabs-bar no-print">
                <button
                    className={`khata-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
                    onClick={() => handleSelectTab('customers')}
                >
                    <Users size={16} />
                    <span>Customers Khata</span>
                    <span className="badge-count">{summaryMetrics.customerCount}</span>
                </button>
                <button
                    className={`khata-tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
                    onClick={() => handleSelectTab('suppliers')}
                >
                    <Truck size={16} />
                    <span>Suppliers Khata</span>
                    <span className="badge-count">{summaryMetrics.supplierCount}</span>
                </button>
                <button
                    className={`khata-tab-btn ${activeTab === 'daybook' ? 'active' : ''}`}
                    onClick={() => handleSelectTab('daybook')}
                >
                    <Calendar size={16} />
                    <span>Day Book (Roznamcha)</span>
                </button>
            </div>

            {/* ── VIEW 1: CUSTOMERS / SUPPLIERS SPLIT VIEW ─────────────── */}
            {activeTab !== 'daybook' && (
                <div className="khata-split-layout no-print">
                    {/* LEFT PANE: Parties List */}
                    <div className="khata-parties-pane">
                        <div className="khata-parties-header">
                            <div className="khata-search-input-wrap">
                                <Search size={16} />
                                <input
                                    type="text"
                                    className="khata-search-input"
                                    placeholder={`Search ${activeTab === 'suppliers' ? 'supplier' : 'customer'} name or phone...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="khata-filter-chips">
                                <button
                                    className={`khata-chip ${filterStatus === 'ALL' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('ALL')}
                                >
                                    All ({filteredParties.length})
                                </button>
                                <button
                                    className={`khata-chip ${filterStatus === 'PENDING' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('PENDING')}
                                >
                                    Pending Due
                                </button>
                                <button
                                    className={`khata-chip ${filterStatus === 'SETTLED' ? 'active' : ''}`}
                                    onClick={() => setFilterStatus('SETTLED')}
                                >
                                    Settled (Nil)
                                </button>
                            </div>
                        </div>

                        <div className="khata-parties-list">
                            {filteredParties.length > 0 ? (
                                filteredParties.map(party => {
                                    const bal = Number(party.netBalance || 0);
                                    const isSelected = selectedParty?.id === party.id;
                                    const balClass = bal > 0 ? 'bal-get' : bal < 0 ? 'bal-give' : 'bal-settled';
                                    const balLabel = bal > 0 ? "You'll Get" : bal < 0 ? "You'll Give" : 'Settled';

                                    return (
                                        <div
                                            key={party.id}
                                            className={`khata-party-row ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedParty(party)}
                                        >
                                            <div className="khata-party-row-left">
                                                <div className={`party-avatar ${party.partyType === 'SUPPLIER' ? 'avatar-supplier' : 'avatar-customer'}`}>
                                                    {(party.name || 'U').slice(0, 2)}
                                                </div>
                                                <div className="party-name-meta">
                                                    <span className="party-row-name" title={party.name}>{party.name}</span>
                                                    <span className="party-row-phone">{party.phone || 'No phone'}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className={`khata-party-row-right ${balClass}`}>
                                                    <div className="party-bal-amount">{formatCurrency(Math.abs(bal))}</div>
                                                    <span className="party-bal-badge">{balLabel}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="party-quick-wa-btn"
                                                    title={`Send WhatsApp message to ${party.name}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedParty(party);
                                                        openWhatsAppModal(party);
                                                    }}
                                                >
                                                    <Send size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                                    <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                    <p style={{ fontSize: '13px', margin: 0 }}>No {activeTab} found.</p>
                                    <button
                                        className="khata-btn khata-btn-primary"
                                        style={{ marginTop: '12px', fontSize: '12px', padding: '6px 14px' }}
                                        onClick={openAddPartyModal}
                                    >
                                        <Plus size={14} /> Add First {activeTab === 'suppliers' ? 'Supplier' : 'Customer'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANE: Selected Party Passbook Ledger */}
                    <div className="khata-ledger-pane">
                        {selectedParty ? (
                            <>
                                {/* Ledger Header */}
                                <div className="ledger-header">
                                    <div className="ledger-party-profile">
                                        <div className={`ledger-avatar-big ${selectedParty.partyType === 'SUPPLIER' ? 'avatar-supplier' : 'avatar-customer'}`}>
                                            {(selectedParty.name || 'U').slice(0, 2)}
                                        </div>
                                        <div className="ledger-title-text">
                                            <h3>{selectedParty.name}</h3>
                                            <div className="ledger-party-contacts">
                                                {selectedParty.phone && (
                                                    <span><Phone size={13} /> {selectedParty.phone}</span>
                                                )}
                                                {selectedParty.address && (
                                                    <span><MapPin size={13} /> {selectedParty.address}</span>
                                                )}
                                                <span><span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{selectedParty.partyType}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ledger-balance-box">
                                        <div className="balance-title">
                                            {(selectedParty.netBalance || 0) > 0 ? "You'll Get (Receivable)" : (selectedParty.netBalance || 0) < 0 ? "You'll Give (Payable)" : 'Account Settled'}
                                        </div>
                                        <div className={`balance-val ${(selectedParty.netBalance || 0) > 0 ? 'text-get' : (selectedParty.netBalance || 0) < 0 ? 'text-give' : 'text-muted'}`}>
                                            {formatCurrency(Math.abs(selectedParty.netBalance || 0))}
                                        </div>
                                    </div>
                                </div>

                                {/* Ledger Action Bar */}
                                <div className="ledger-action-bar">
                                    <div className="ledger-action-buttons">
                                        <button
                                            className="khata-btn khata-btn-whatsapp"
                                            onClick={() => openWhatsAppModal(selectedParty)}
                                            title="Send WhatsApp payment reminder / statement"
                                        >
                                            <Send size={15} />
                                            WhatsApp Reminder
                                        </button>
                                        <button
                                            className="khata-btn khata-btn-secondary"
                                            onClick={handlePrintStatement}
                                            title="Print passbook statement"
                                        >
                                            <Printer size={15} />
                                            Print Statement
                                        </button>
                                    </div>
                                    <div className="ledger-action-buttons">
                                        <button
                                            className="khata-btn khata-btn-secondary"
                                            onClick={() => openEditPartyModal(selectedParty)}
                                            title="Edit Party Details"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            className="khata-btn khata-btn-secondary"
                                            style={{ color: '#ef4444' }}
                                            onClick={() => handleDeleteParty(selectedParty)}
                                            title="Delete Party & Ledger"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Ledger Passbook Table */}
                                <div className="ledger-table-wrapper">
                                    <table className="ledger-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '130px' }}>Date</th>
                                                <th>Details / Bill Reference</th>
                                                <th style={{ width: '110px' }}>Mode</th>
                                                <th style={{ width: '130px', textAlign: 'right' }}>You Gave (Debit)</th>
                                                <th style={{ width: '130px', textAlign: 'right' }}>You Got (Credit)</th>
                                                <th style={{ width: '130px', textAlign: 'right' }}>Balance</th>
                                                <th style={{ width: '50px', textAlign: 'center' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Opening Balance Row */}
                                            {selectedParty.openingBalance && Number(selectedParty.openingBalance) > 0 && (
                                                <tr style={{ background: '#f8fafc', fontStyle: 'italic' }}>
                                                    <td>Starting</td>
                                                    <td>
                                                        <span style={{ fontWeight: '600', color: '#475569' }}>Opening Balance</span>
                                                    </td>
                                                    <td>
                                                        <span className="payment-mode-tag">Opening</span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {selectedParty.openingBalanceType === 'YOU_WILL_GET' ? formatCurrency(selectedParty.openingBalance) : '-'}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {selectedParty.openingBalanceType === 'YOU_WILL_GIVE' ? formatCurrency(selectedParty.openingBalance) : '-'}
                                                    </td>
                                                    <td style={{ textAlign: 'right', fontWeight: '700' }}>
                                                        {formatCurrency(selectedParty.openingBalance)}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            )}

                                            {activePartyTransactions.length > 0 ? (
                                                activePartyTransactions.map(tx => {
                                                    const isGave = tx.transactionType === 'GAVE';
                                                    return (
                                                        <tr key={tx.id}>
                                                            <td style={{ fontSize: '12px', color: '#64748b' }}>
                                                                {tx.transactionDate}
                                                            </td>
                                                            <td>
                                                                <div style={{ fontWeight: '600', color: '#0f172a' }}>
                                                                    {tx.referenceNumber ? `Ref: ${tx.referenceNumber}` : (isGave ? 'Udhar Diya (Goods/Credit)' : 'Payment Received')}
                                                                </div>
                                                                {tx.notes && (
                                                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                                        {tx.notes}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span className="payment-mode-tag">
                                                                    {tx.paymentMode || 'CASH'}
                                                                </span>
                                                            </td>
                                                            <td style={{ textAlign: 'right' }} className="amount-gave">
                                                                {isGave ? formatCurrency(tx.amount) : '-'}
                                                            </td>
                                                            <td style={{ textAlign: 'right' }} className="amount-got">
                                                                {!isGave ? formatCurrency(tx.amount) : '-'}
                                                            </td>
                                                            <td style={{ textAlign: 'right', fontWeight: '700', color: (tx.runningBalance || 0) >= 0 ? '#059669' : '#dc2626' }}>
                                                                {formatCurrency(Math.abs(tx.runningBalance || 0))}
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <button
                                                                    onClick={() => handleDeleteTx(tx)}
                                                                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                                                                    title="Delete transaction"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                                                        No transactions recorded yet. Use the buttons below to record credit or payment.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Bottom Big Buttons: YOU GAVE vs YOU GOT */}
                                <div className="ledger-entry-footer">
                                    <button
                                        className="btn-gave"
                                        onClick={() => openAddTxModal('GAVE')}
                                    >
                                        <ArrowDownRight size={20} />
                                        <span>YOU GAVE ₹ (Debit)</span>
                                    </button>
                                    <button
                                        className="btn-got"
                                        onClick={() => openAddTxModal('GOT')}
                                    >
                                        <ArrowUpLeft size={20} />
                                        <span>YOU GOT ₹ (Credit)</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', padding: '40px' }}>
                                <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                                <h4 style={{ color: '#475569', margin: '0 0 8px 0' }}>No Party Selected</h4>
                                <p style={{ fontSize: '13px', margin: 0, textAlign: 'center', maxWidth: '300px' }}>
                                    Select a party from the left panel to view their complete passbook ledger statement.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── VIEW 2: DAYBOOK (DAILY ROZNAMCHA) ────────────────────── */}
            {activeTab === 'daybook' && (
                <div className="daybook-panel no-print">
                    <div className="daybook-header">
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                                Day Book (Daily Roznamcha)
                            </h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                                Consolidated chronological log of all credits and debits across all accounts.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Date:</span>
                                <input
                                    type="date"
                                    className="khata-form-input"
                                    style={{ width: 'auto', padding: '6px 12px' }}
                                    value={daybookDate}
                                    onChange={(e) => setDaybookDate(e.target.value)}
                                />
                            </div>
                            <button className="khata-btn khata-btn-secondary" onClick={handlePrintStatement}>
                                <Printer size={15} /> Print Daybook
                            </button>
                        </div>
                    </div>

                    <div className="ledger-table-wrapper" style={{ maxHeight: '600px' }}>
                        <table className="ledger-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Party Name</th>
                                    <th>Type</th>
                                    <th>Reference / Notes</th>
                                    <th>Mode</th>
                                    <th style={{ textAlign: 'right' }}>You Gave (Out)</th>
                                    <th style={{ textAlign: 'right' }}>You Got (In)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daybookTransactions.length > 0 ? (
                                    daybookTransactions.map(tx => {
                                        const isGave = tx.transactionType === 'GAVE';
                                        return (
                                            <tr key={tx.id}>
                                                <td style={{ fontSize: '12px', color: '#64748b' }}>
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : tx.transactionDate}
                                                </td>
                                                <td style={{ fontWeight: '600', color: '#0f172a' }}>
                                                    {tx.partyName || `Party #${tx.partyId}`}
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '10px', fontWeight: '700', background: tx.partyType === 'SUPPLIER' ? '#fae8ff' : '#e0f2fe', color: tx.partyType === 'SUPPLIER' ? '#86198f' : '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>
                                                        {tx.partyType || 'CUSTOMER'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '13px' }}>{tx.referenceNumber || '-'}</div>
                                                    {tx.notes && <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.notes}</div>}
                                                </td>
                                                <td>
                                                    <span className="payment-mode-tag">{tx.paymentMode || 'CASH'}</span>
                                                </td>
                                                <td style={{ textAlign: 'right' }} className="amount-gave">
                                                    {isGave ? formatCurrency(tx.amount) : '-'}
                                                </td>
                                                <td style={{ textAlign: 'right' }} className="amount-got">
                                                    {!isGave ? formatCurrency(tx.amount) : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                                            No transactions found for date {daybookDate}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── MODAL: ADD / EDIT PARTY ──────────────────────────────── */}
            {isPartyModalOpen && (
                <div className="khata-modal-overlay">
                    <div className="khata-modal-card">
                        <div className="khata-modal-header">
                            <h4>
                                <Users size={18} color="#ea580c" />
                                {editingParty ? 'Edit Party Details' : `Add New ${partyForm.partyType === 'SUPPLIER' ? 'Supplier' : 'Customer'}`}
                            </h4>
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                onClick={() => setIsPartyModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveParty}>
                            <div className="khata-modal-body">
                                <div className="khata-form-group">
                                    <label className="khata-form-label">Party Type</label>
                                    <select
                                        className="khata-form-select"
                                        value={partyForm.partyType}
                                        onChange={(e) => setPartyForm({ ...partyForm, partyType: e.target.value })}
                                        disabled={!!editingParty}
                                    >
                                        <option value="CUSTOMER">Customer (Grahak)</option>
                                        <option value="SUPPLIER">Supplier (Vyapari / Vendor)</option>
                                    </select>
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Party / Business Name *</label>
                                    <input
                                        type="text"
                                        className="khata-form-input"
                                        placeholder="E.g. Ramesh Kumar or Balaji Traders"
                                        value={partyForm.name}
                                        onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Phone Number (For WhatsApp Reminders)</label>
                                    <input
                                        type="tel"
                                        className="khata-form-input"
                                        placeholder="E.g. 9876543210"
                                        value={partyForm.phone}
                                        onChange={(e) => setPartyForm({ ...partyForm, phone: e.target.value })}
                                    />
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Email Address (Optional)</label>
                                    <input
                                        type="email"
                                        className="khata-form-input"
                                        placeholder="party@example.com"
                                        value={partyForm.email}
                                        onChange={(e) => setPartyForm({ ...partyForm, email: e.target.value })}
                                    />
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Address / Location</label>
                                    <input
                                        type="text"
                                        className="khata-form-input"
                                        placeholder="Shop No., Market, City"
                                        value={partyForm.address}
                                        onChange={(e) => setPartyForm({ ...partyForm, address: e.target.value })}
                                    />
                                </div>

                                {!editingParty && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="khata-form-group">
                                            <label className="khata-form-label">Opening Balance ({currencySymbol})</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="khata-form-input"
                                                placeholder="0.00"
                                                value={partyForm.openingBalance}
                                                onChange={(e) => setPartyForm({ ...partyForm, openingBalance: e.target.value })}
                                            />
                                        </div>
                                        <div className="khata-form-group">
                                            <label className="khata-form-label">Balance Type</label>
                                            <select
                                                className="khata-form-select"
                                                value={partyForm.openingBalanceType}
                                                onChange={(e) => setPartyForm({ ...partyForm, openingBalanceType: e.target.value })}
                                            >
                                                <option value="YOU_WILL_GET">You'll Get (Udhar)</option>
                                                <option value="YOU_WILL_GIVE">You'll Give (Advance)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="khata-modal-footer">
                                <button
                                    type="button"
                                    className="khata-btn khata-btn-secondary"
                                    onClick={() => setIsPartyModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="khata-btn khata-btn-primary">
                                    {editingParty ? 'Update Party' : 'Save Party'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: RECORD TRANSACTION (GAVE / GOT) ───────────────── */}
            {isTxModalOpen && selectedParty && (
                <div className="khata-modal-overlay">
                    <div className="khata-modal-card">
                        <div
                            className="khata-modal-header"
                            style={{
                                background: txType === 'GAVE' ? '#fef2f2' : '#ecfdf5',
                                borderBottom: txType === 'GAVE' ? '1px solid #fee2e2' : '1px solid #d1fae5'
                            }}
                        >
                            <h4 style={{ color: txType === 'GAVE' ? '#dc2626' : '#059669' }}>
                                {txType === 'GAVE' ? <ArrowDownRight size={20} /> : <ArrowUpLeft size={20} />}
                                {txType === 'GAVE' ? 'Record: You Gave ₹ (Debit)' : 'Record: You Got ₹ (Credit)'}
                            </h4>
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                onClick={() => setIsTxModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveTransaction}>
                            <div className="khata-modal-body">
                                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>
                                    Party: <strong style={{ color: '#0f172a' }}>{selectedParty.name}</strong> ({selectedParty.partyType})
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Amount ({currencySymbol}) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="khata-form-input"
                                        placeholder="0.00"
                                        value={txForm.amount}
                                        onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                                        required
                                        autoFocus
                                        style={{ fontSize: '18px', fontWeight: '700' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="khata-form-group">
                                        <label className="khata-form-label">Payment Mode</label>
                                        <select
                                            className="khata-form-select"
                                            value={txForm.paymentMode}
                                            onChange={(e) => setTxForm({ ...txForm, paymentMode: e.target.value })}
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="UPI">UPI (GPay/PhonePe/Paytm)</option>
                                            <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                                            <option value="CHEQUE">Cheque</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="khata-form-group">
                                        <label className="khata-form-label">Date</label>
                                        <input
                                            type="date"
                                            className="khata-form-input"
                                            value={txForm.transactionDate}
                                            onChange={(e) => setTxForm({ ...txForm, transactionDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Bill / Invoice Reference #</label>
                                    <input
                                        type="text"
                                        className="khata-form-input"
                                        placeholder="E.g. INV-1029 or UPI-998811"
                                        value={txForm.referenceNumber}
                                        onChange={(e) => setTxForm({ ...txForm, referenceNumber: e.target.value })}
                                    />
                                </div>

                                <div className="khata-form-group">
                                    <label className="khata-form-label">Notes / Items Description</label>
                                    <textarea
                                        rows="2"
                                        className="khata-form-textarea"
                                        placeholder="E.g. 5 bags wheat flour, partial payment"
                                        value={txForm.notes}
                                        onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                                    />
                                </div>

                                <div style={{
                                    background: '#f0fdf4',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #bbf7d0',
                                    marginTop: '8px'
                                }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#14532d', fontWeight: '600' }}>
                                        <input
                                            type="checkbox"
                                            checked={sendTxWhatsApp}
                                            onChange={e => setSendTxWhatsApp(e.target.checked)}
                                        />
                                        <span>Send WhatsApp entry receipt to {selectedParty.name}</span>
                                    </label>
                                    <div style={{ fontSize: '11px', color: '#15803d', marginTop: '3px', marginLeft: '22px' }}>
                                        {settings?.whatsappBackgroundAutoSend === 'true' 
                                            ? '✓ Automatically dispatches receipt in background (Zero windows opened)' 
                                            : 'Will open WhatsApp with entry confirmation receipt'}
                                    </div>
                                </div>
                            </div>
                            <div className="khata-modal-footer">
                                <button
                                    type="button"
                                    className="khata-btn khata-btn-secondary"
                                    onClick={() => setIsTxModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="khata-btn"
                                    style={{
                                        background: txType === 'GAVE' ? '#dc2626' : '#059669',
                                        color: '#ffffff'
                                    }}
                                >
                                    {txType === 'GAVE' ? 'Confirm: You Gave ₹' : 'Confirm: You Got ₹'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── PRINTABLE STATEMENT SHEET (Visible only during window.print()) ── */}
            {selectedParty && (
                <div className="khata-printable-sheet" style={{ display: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '900' }}>{companyInfo?.name || 'Namustutam Business'}</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Digital Ledger & Khata Statement</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Statement Date</div>
                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Statement For</div>
                            <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: '800' }}>{selectedParty.name}</h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                                {selectedParty.phone && `Phone: ${selectedParty.phone} | `}
                                {selectedParty.address && `Address: ${selectedParty.address}`}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>Closing Balance</div>
                            <h3 style={{ margin: '4px 0', fontSize: '20px', fontWeight: '900', color: (selectedParty.netBalance || 0) > 0 ? '#059669' : '#dc2626' }}>
                                {formatCurrency(Math.abs(selectedParty.netBalance || 0))}
                            </h3>
                            <div style={{ fontSize: '11px', fontWeight: '700' }}>
                                {(selectedParty.netBalance || 0) > 0 ? "You'll Get (Receivable)" : "You'll Give (Payable)"}
                            </div>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Details</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Mode</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Debit (Gave)</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Credit (Got)</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activePartyTransactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '10px' }}>{tx.transactionDate}</td>
                                    <td style={{ padding: '10px' }}>
                                        {tx.referenceNumber ? `Ref: ${tx.referenceNumber} - ` : ''}
                                        {tx.notes || tx.transactionType}
                                    </td>
                                    <td style={{ padding: '10px' }}>{tx.paymentMode}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626' }}>
                                        {tx.transactionType === 'GAVE' ? formatCurrency(tx.amount) : '-'}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: '#059669' }}>
                                        {tx.transactionType === 'GOT' ? formatCurrency(tx.amount) : '-'}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700' }}>
                                        {formatCurrency(Math.abs(tx.runningBalance || 0))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Generated automatically via Namustutam POS Khata Book.<br/>
                            This is a computer-generated statement.
                        </div>
                        <div style={{ textAlign: 'center', width: '180px' }}>
                            <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '6px', height: '40px' }}></div>
                            <div style={{ fontSize: '11px', fontWeight: '700' }}>Authorized Signature</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DYNAMIC WHATSAPP MESSENGER & REMINDER MODAL ── */}
            {isWaModalOpen && waParty && (
                <div className="khata-modal-overlay" onClick={e => e.target === e.currentTarget && setIsWaModalOpen(false)}>
                    <div className="khata-modal-card khata-wa-modal-card">
                        {/* Header */}
                        <div className="khata-modal-header khata-wa-modal-header">
                            <div className="khata-wa-header-info">
                                <div className="khata-wa-logo-icon">
                                    <Send size={18} />
                                </div>
                                <div>
                                    <h4>Send WhatsApp to {waParty.name}</h4>
                                    <span className="khata-wa-header-sub">
                                        {settings?.whatsappBackgroundAutoSend === 'true' 
                                            ? 'Background API Mode Active (Zero Windows Opened)' 
                                            : 'WhatsApp Web & Background Dispatcher'}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="khata-modal-close-btn"
                                onClick={() => setIsWaModalOpen(false)}
                                type="button"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="khata-modal-body khata-wa-modal-body">
                            {/* Status Alert Banner */}
                            {waStatus && (
                                <div className={`khata-wa-alert-banner ${waStatus.type}`}>
                                    {waStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{waStatus.text}</span>
                                    {waStatus.canFallback && (
                                        <button
                                            type="button"
                                            className="khata-wa-fallback-btn"
                                            onClick={() => handleSendKhataWhatsApp(true)}
                                        >
                                            <ExternalLink size={12} /> Open Web
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="khata-wa-alert-close"
                                        onClick={() => setWaStatus(null)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Recipient & Balance Summary Card */}
                            <div className="khata-wa-party-summary">
                                <div className="khata-wa-summary-left">
                                    <div className={`party-avatar ${waParty.partyType === 'SUPPLIER' ? 'avatar-supplier' : 'avatar-customer'}`}>
                                        {(waParty.name || 'U').slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="khata-wa-party-name">{waParty.name}</div>
                                        <div className="khata-wa-phone-row">
                                            <Phone size={12} />
                                            <input
                                                type="tel"
                                                className="khata-wa-phone-input"
                                                value={waPhone}
                                                onChange={e => setWaPhone(e.target.value)}
                                                placeholder="Enter mobile (e.g. 9876543210)"
                                                title="Recipient WhatsApp Number"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="khata-wa-summary-right">
                                    <div className="khata-wa-bal-label">Current Balance</div>
                                    <div className={`khata-wa-bal-val ${(waParty.netBalance || 0) > 0 ? 'text-get' : (waParty.netBalance || 0) < 0 ? 'text-give' : 'text-muted'}`}>
                                        {formatCurrency(Math.abs(waParty.netBalance || 0))}
                                    </div>
                                    <span className="party-bal-badge" style={{ 
                                        background: (waParty.netBalance || 0) > 0 ? '#ecfdf5' : '#fef2f2',
                                        color: (waParty.netBalance || 0) > 0 ? '#059669' : '#dc2626' 
                                    }}>
                                        {(waParty.netBalance || 0) > 0 ? "You'll Get (Due)" : (waParty.netBalance || 0) < 0 ? "You'll Give (Advance)" : 'Settled'}
                                    </span>
                                </div>
                            </div>

                            {/* Message Type Tabs */}
                            <div className="khata-wa-tabs">
                                <button
                                    type="button"
                                    className={`khata-wa-tab ${waMessageType === 'reminder' ? 'active' : ''}`}
                                    onClick={() => setWaMessageType('reminder')}
                                >
                                    <Zap size={14} />
                                    <span>Payment Reminder</span>
                                </button>
                                <button
                                    type="button"
                                    className={`khata-wa-tab ${waMessageType === 'statement' ? 'active' : ''}`}
                                    onClick={() => setWaMessageType('statement')}
                                >
                                    <BookOpen size={14} />
                                    <span>Passbook Statement</span>
                                </button>
                                <button
                                    type="button"
                                    className={`khata-wa-tab ${waMessageType === 'custom' ? 'active' : ''}`}
                                    onClick={() => setWaMessageType('custom')}
                                >
                                    <MessageSquare size={14} />
                                    <span>Custom Message</span>
                                </button>
                            </div>

                            {/* Extra Options */}
                            {(waParty.netBalance || 0) > 0 && (
                                <div className="khata-wa-option-toggle">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '600', color: '#1e293b' }}>
                                        <input
                                            type="checkbox"
                                            checked={waIncludeUpi}
                                            onChange={e => setWaIncludeUpi(e.target.checked)}
                                        />
                                        <span>Include Direct UPI Payment Link (GPay / PhonePe / Paytm / BHIM)</span>
                                    </label>
                                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500' }}>
                                        ✓ Customer can tap to pay immediately in WhatsApp!
                                    </span>
                                </div>
                            )}

                            {/* Custom Message Field */}
                            {waMessageType === 'custom' && (
                                <div className="khata-form-group" style={{ marginTop: '10px' }}>
                                    <label className="khata-form-label">Custom Message Text</label>
                                    <textarea
                                        rows="3"
                                        className="khata-form-textarea"
                                        placeholder="Write custom reminder text... Variables: {party_name}, {balance}, {store_name}, {date}"
                                        value={waCustomMessage}
                                        onChange={e => setWaCustomMessage(e.target.value)}
                                    />
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                        {['{party_name}', '{balance}', '{store_name}', '{date}'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className="khata-chip"
                                                onClick={() => setWaCustomMessage(prev => prev + ' ' + tag)}
                                                style={{ fontSize: '10.5px', padding: '2px 8px' }}
                                            >
                                                +{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live WhatsApp Chat Bubble Preview */}
                            <div className="khata-wa-preview-wrap">
                                <div className="khata-wa-preview-topbar">
                                    <div className="khata-wa-preview-avatar">
                                        {(companyInfo?.name || settings?.companyName || 'N').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="khata-wa-preview-store">
                                            {companyInfo?.name || settings?.companyName || 'Namustutam Store'} (Official)
                                        </div>
                                        <div className="khata-wa-preview-status">Online • Verified Business</div>
                                    </div>
                                </div>
                                <div className="khata-wa-chat-bg">
                                    <div className="khata-wa-chat-bubble">
                                        <pre className="khata-wa-bubble-text">{getCompiledKhataMessage()}</pre>
                                        <div className="khata-wa-bubble-time">
                                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span style={{ color: '#53bdeb' }}>✓✓</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Send Buttons */}
                        <div className="khata-modal-footer khata-wa-modal-footer">
                            <button
                                type="button"
                                className="khata-btn khata-btn-secondary"
                                onClick={() => setIsWaModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="khata-btn khata-btn-web-alt"
                                onClick={() => handleSendKhataWhatsApp(true)}
                                title="Open in WhatsApp Web browser tab"
                            >
                                <ExternalLink size={14} />
                                Open Web (wa.me)
                            </button>
                            <button
                                type="button"
                                className="khata-btn khata-btn-whatsapp-primary"
                                onClick={() => handleSendKhataWhatsApp(false)}
                                disabled={waSending}
                            >
                                {waSending ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
                                {waSending 
                                    ? 'Dispatching...' 
                                    : (settings?.whatsappBackgroundAutoSend === 'true' || settings?.whatsappMode === 'cloud_api' || settings?.whatsappMode === 'gateway'
                                        ? 'Send in Background (No Window)' 
                                        : 'Send WhatsApp Message')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FLOATING TOAST NOTIFICATION ── */}
            {khataToast && (
                <div className="khata-floating-toast">
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{khataToast}</span>
                    <button type="button" onClick={() => setKhataToast(null)}>
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
