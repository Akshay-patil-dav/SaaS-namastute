import { RefreshCw, CheckCircle, Edit2, Shield, Search, PenTool, Code2, ShieldCheck, Rocket, Users, Settings, Activity, X } from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';

const ICON_MAP = {
    Search, PenTool, Code2, ShieldCheck, Rocket, Users, Settings, Activity
};

export default function SdlcTab() {
    const { landingData, updateSdlcStep } = useLandingPage();
    const steps = landingData.sdlcSteps || [];

    const [editingStep, setEditingStep] = useState(null);
    const [formData, setFormData] = useState({ title: '', desc: '', icon: 'Code2' });

    const openEdit = (step) => {
        setEditingStep(step);
        setFormData({
            title: step.title || '',
            desc: step.desc || '',
            icon: step.icon || 'Code2'
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingStep) {
            updateSdlcStep(editingStep.num, formData);
            setEditingStep(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SectionVisibilityBanner 
                sectionKey="sdlc" 
                sectionName="SDLC Process Roadmap" 
                description="Controls whether the 8-phase software engineering delivery roadmap is displayed on the public landing page."
            />

            <div className="admin-card" style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className="admin-card-title">
                            <RefreshCw size={18} color="#8b5cf6" />
                            SDLC & Architecture Roadmap
                        </h3>
                        <div className="admin-card-subtitle">
                            Configure the 8 sequential delivery phases displayed in the Expertise Section
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '18px'
            }}>
                {steps.map((step) => {
                    const IconComponent = ICON_MAP[step.icon] || Code2;
                    return (
                        <div
                            key={step.num}
                            className="admin-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    color: '#818cf8',
                                    fontWeight: '800',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(99, 102, 241, 0.3)'
                                }}>
                                    {step.num}
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        color: '#ff8c42',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <IconComponent size={20} />
                                    </div>
                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '11px' }}
                                        onClick={() => openEdit(step)}
                                    >
                                        <Edit2 size={12} />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 6px' }}>
                                    {step.title}
                                </h4>
                                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingStep && (
                <div className="admin-modal-overlay" onClick={() => setEditingStep(null)}>
                    <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3 className="admin-modal-title">
                                Edit SDLC Step #{editingStep.num}
                            </h3>
                            <button className="admin-modal-close" onClick={() => setEditingStep(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div className="admin-form-grid">
                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Phase Title</label>
                                    <input
                                        type="text"
                                        className="admin-control-input"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                                    <label className="admin-label">Phase Description</label>
                                    <textarea
                                        className="admin-control-textarea"
                                        rows={3}
                                        required
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setEditingStep(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    Update Step
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
