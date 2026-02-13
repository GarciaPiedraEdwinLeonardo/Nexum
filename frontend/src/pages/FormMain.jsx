import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AiOutlineFileText,
    AiOutlineCheckCircle,
    AiOutlineCloudUpload,
    AiOutlineArrowRight,
    AiOutlineSafety,
    AiOutlineRocket,
    AiOutlineBook,
    AiOutlineBank
} from 'react-icons/ai';
import {
    BsShieldCheck,
    BsMortarboard,
    BsBuilding
} from 'react-icons/bs';
import {
    EDUCATION_LEVELS,
    EDUCATION_LEVEL_LABELS,
    getEscuelasByNivel,
    getCarrerasByEscuela
} from '../data/academicData';
import logoNexum from '../assets/logo-nexum.png';

function FormMain() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nivelEducativo: '',
        escuela: '',
        carrera: '',
        constanciaEstudios: null
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredLevel, setHoveredLevel] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    // Obtener escuelas disponibles según nivel educativo
    const escuelasDisponibles = formData.nivelEducativo
        ? getEscuelasByNivel(formData.nivelEducativo)
        : [];

    // Obtener carreras disponibles según escuela
    const carrerasDisponibles = formData.escuela
        ? getCarrerasByEscuela(formData.nivelEducativo, formData.escuela)
        : [];

    const handleNivelEducativoChange = (nivel) => {
        setFormData({
            nivelEducativo: nivel,
            escuela: '',
            carrera: '',
            constanciaEstudios: formData.constanciaEstudios
        });
        setErrors({});
    };

    const handleEscuelaChange = (escuelaId) => {
        setFormData(prev => ({
            ...prev,
            escuela: escuelaId,
            carrera: '' // Reset carrera cuando cambia escuela
        }));
        if (errors.escuela) {
            setErrors(prev => ({ ...prev, escuela: '' }));
        }
    };

    const handleCarreraChange = (carreraId) => {
        setFormData(prev => ({
            ...prev,
            carrera: carreraId
        }));
        if (errors.carrera) {
            setErrors(prev => ({ ...prev, carrera: '' }));
        }
    };

    const handleFileChange = (file) => {
        if (!file) return;

        // Validar que sea PDF
        if (file.type !== 'application/pdf') {
            setErrors(prev => ({
                ...prev,
                constanciaEstudios: 'Solo se permiten archivos PDF'
            }));
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                constanciaEstudios: 'El archivo no puede superar los 5MB'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            constanciaEstudios: file
        }));

        if (errors.constanciaEstudios) {
            setErrors(prev => ({ ...prev, constanciaEstudios: '' }));
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleFileChange(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nivelEducativo) {
            newErrors.nivelEducativo = 'Debes seleccionar un nivel educativo';
        }

        if (!formData.escuela) {
            newErrors.escuela = 'Debes seleccionar una unidad académica';
        }

        if (!formData.carrera) {
            newErrors.carrera = 'Debes seleccionar una carrera';
        }

        if (!formData.constanciaEstudios) {
            newErrors.constanciaEstudios = 'Debes subir tu constancia de estudios';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Aquí irá la llamada al API
            console.log('Datos del formulario:', formData);

            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Redirigir al dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error('Error al completar onboarding:', error);
            setErrors({ submit: 'Error al enviar el formulario. Intenta nuevamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Calcular progreso
    const getProgress = () => {
        let steps = 0;
        if (formData.nivelEducativo) steps++;
        if (formData.escuela) steps++;
        if (formData.carrera) steps++;
        if (formData.constanciaEstudios) steps++;
        return (steps / 4) * 100;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #F2F2F2 0%, #FFFFFF 50%, #F2F2F2 100%)'
            }}>

            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(31, 58, 95, 0.03) 0%, transparent 70%)',
                        transform: 'translate(-30%, -30%)'
                    }} />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(122, 30, 45, 0.03) 0%, transparent 70%)',
                        transform: 'translate(30%, 30%)'
                    }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
                    <div className="grid grid-cols-3 gap-4 opacity-[0.02]">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-full border-2 border-[#1F3A5F]"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* Header con logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#7A1E2D] to-[#1F3A5F] rounded-2xl opacity-10 blur-xl"></div>
                            <img
                                src={logoNexum}
                                alt="Nexum"
                                className="relative z-10 h-16 w-auto"
                                style={{
                                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
                                }}
                            />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-3"
                        style={{
                            background: 'linear-gradient(135deg, #7A1E2D 0%, #1F3A5F 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                        Completa tu perfil para comenzar
                    </h1>
                </div>

                {/* Barra de progreso */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium" style={{ color: '#2E2E2E' }}>
                            Progreso del perfil
                        </span>
                        <span className="text-sm font-bold" style={{ color: '#7A1E2D' }}>
                            {Math.round(getProgress())}%
                        </span>
                    </div>
                    <div className="h-2 bg-[#F2F2F2] rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 ease-out rounded-full"
                            style={{
                                width: `${getProgress()}%`,
                                background: 'linear-gradient(90deg, #7A1E2D 0%, #1F3A5F 100%)'
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-xs" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>Nivel</span>
                        <span className="text-xs" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>Unidad</span>
                        <span className="text-xs" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>Carrera</span>
                        <span className="text-xs" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>Documento</span>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-2xl p-10 relative overflow-hidden"
                    style={{
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(122, 30, 45, 0.1)'
                    }}>

                    {/* Decoración superior del formulario */}
                    <div className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: 'linear-gradient(90deg, #7A1E2D 0%, #1F3A5F 50%, #7A1E2D 100%)' }} />

                    <div className="space-y-8">
                        {/* Nivel Educativo */}
                        <div>
                            <label className="block text-lg font-semibold mb-4 flex items-center gap-2"
                                style={{ color: '#2E2E2E' }}>
                                <BsMortarboard className="text-[#7A1E2D]" />
                                Nivel de Estudios Cursando Actualmente
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleNivelEducativoChange(key)}
                                        onMouseEnter={() => setHoveredLevel(key)}
                                        onMouseLeave={() => setHoveredLevel(null)}
                                        className="p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group"
                                        style={{
                                            borderColor: formData.nivelEducativo === key ? '#7A1E2D' : '#E8E8E8',
                                            backgroundColor: formData.nivelEducativo === key ? 'rgba(122, 30, 45, 0.02)' : 'white',
                                            boxShadow: formData.nivelEducativo === key ? '0 8px 20px rgba(122, 30, 45, 0.15)' : hoveredLevel === key ? '0 8px 20px rgba(0, 0, 0, 0.05)' : 'none',
                                            transform: hoveredLevel === key ? 'translateY(-2px)' : 'translateY(0)'
                                        }}
                                    >
                                        {/* Efecto de brillo */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                background: 'radial-gradient(circle at 50% 0%, rgba(122, 30, 45, 0.05), transparent 70%)'
                                            }} />

                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="font-semibold text-base"
                                                style={{ color: formData.nivelEducativo === key ? '#7A1E2D' : '#2E2E2E' }}>
                                                {label}
                                            </span>
                                            {formData.nivelEducativo === key && (
                                                <div className="relative">
                                                    <AiOutlineCheckCircle size={24} style={{ color: '#7A1E2D' }} />
                                                    <div className="absolute inset-0 animate-ping opacity-20">
                                                        <AiOutlineCheckCircle size={24} style={{ color: '#7A1E2D' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Icono decorativo */}
                                        <div className="absolute bottom-2 right-2 text-4xl opacity-5 transform rotate-12">
                                            <BsBuilding />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.nivelEducativo && (
                                <p className="mt-2 text-sm flex items-center gap-1" style={{ color: '#D32F2F' }}>
                                    <span>⚠️</span> {errors.nivelEducativo}
                                </p>
                            )}
                        </div>

                        {/* Unidad Académica */}
                        {formData.nivelEducativo && (
                            <div className="animate-fade-in">
                                <label className="block text-lg font-semibold mb-4 flex items-center gap-2"
                                    style={{ color: '#2E2E2E' }}>
                                    <BsBuilding className="text-[#1F3A5F]" />
                                    Unidad Académica
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.escuela}
                                        onChange={(e) => handleEscuelaChange(e.target.value)}
                                        onFocus={() => setFocusedField('escuela')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base appearance-none cursor-pointer"
                                        style={{
                                            borderColor: errors.escuela ? '#D32F2F' : focusedField === 'escuela' ? '#7A1E2D' : '#E8E8E8',
                                            color: '#2E2E2E',
                                            backgroundColor: '#FFFFFF',
                                            boxShadow: focusedField === 'escuela' ? '0 0 0 4px rgba(122, 30, 45, 0.1)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                                        }}
                                    >
                                        <option value="">Selecciona tu unidad académica</option>
                                        {escuelasDisponibles.map(escuela => (
                                            <option key={escuela.id} value={escuela.id}>
                                                {escuela.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                        style={{ color: '#7A1E2D' }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.escuela && (
                                    <p className="mt-2 text-sm flex items-center gap-1" style={{ color: '#D32F2F' }}>
                                        <span>⚠️</span> {errors.escuela}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Carrera */}
                        {formData.escuela && (
                            <div className="animate-fade-in">
                                <label className="block text-lg font-semibold mb-4 flex items-center gap-2"
                                    style={{ color: '#2E2E2E' }}>
                                    <AiOutlineBook className="text-[#1F3A5F]" />
                                    {formData.nivelEducativo === EDUCATION_LEVELS.MEDIO_SUPERIOR
                                        ? 'Carrera Técnica'
                                        : 'Carrera Universitaria'}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.carrera}
                                        onChange={(e) => handleCarreraChange(e.target.value)}
                                        onFocus={() => setFocusedField('carrera')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 text-base appearance-none cursor-pointer"
                                        style={{
                                            borderColor: errors.carrera ? '#D32F2F' : focusedField === 'carrera' ? '#7A1E2D' : '#E8E8E8',
                                            color: '#2E2E2E',
                                            backgroundColor: '#FFFFFF',
                                            boxShadow: focusedField === 'carrera' ? '0 0 0 4px rgba(122, 30, 45, 0.1)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
                                        }}
                                    >
                                        <option value="">Selecciona tu carrera</option>
                                        {carrerasDisponibles.map(carrera => (
                                            <option key={carrera.id} value={carrera.id}>
                                                {carrera.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                        style={{ color: '#7A1E2D' }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.carrera && (
                                    <p className="mt-2 text-sm flex items-center gap-1" style={{ color: '#D32F2F' }}>
                                        <span>⚠️</span> {errors.carrera}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Constancia de Estudios */}
                        {formData.carrera && (
                            <div className="animate-fade-in">
                                <label className="block text-lg font-semibold mb-4 flex items-center gap-2"
                                    style={{ color: '#2E2E2E' }}>
                                    <BsShieldCheck className="text-[#2E7D32]" />
                                    Constancia de Estudios
                                </label>

                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    className="relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group"
                                    style={{
                                        borderColor: errors.constanciaEstudios ? '#D32F2F' : (isDragging ? '#7A1E2D' : '#E8E8E8'),
                                        backgroundColor: isDragging ? 'rgba(122, 30, 45, 0.02)' : (formData.constanciaEstudios ? 'rgba(46, 125, 50, 0.02)' : '#FFFFFF'),
                                        boxShadow: isDragging ? '0 0 0 4px rgba(122, 30, 45, 0.1)' : 'none'
                                    }}
                                    onClick={() => document.getElementById('constancia-input').click()}
                                >
                                    <input
                                        id="constancia-input"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />

                                    <div className="text-center relative">
                                        {formData.constanciaEstudios ? (
                                            <>
                                                <div className="relative inline-block">
                                                    <AiOutlineCheckCircle
                                                        size={64}
                                                        className="mx-auto mb-4 animate-bounce"
                                                        style={{ color: '#2E7D32' }}
                                                    />
                                                    <div className="absolute inset-0 animate-ping opacity-20">
                                                        <AiOutlineCheckCircle size={64} className="mx-auto" style={{ color: '#2E7D32' }} />
                                                    </div>
                                                </div>
                                                <p className="text-base font-semibold mb-2" style={{ color: '#2E7D32' }}>
                                                    {formData.constanciaEstudios.name}
                                                </p>
                                                <p className="text-sm mb-4" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                                    {(formData.constanciaEstudios.size / 1024).toFixed(2)} KB
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData(prev => ({ ...prev, constanciaEstudios: null }));
                                                    }}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                                    style={{
                                                        color: '#7A1E2D',
                                                        backgroundColor: 'rgba(122, 30, 45, 0.1)'
                                                    }}
                                                >
                                                    Cambiar archivo
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <AiOutlineCloudUpload
                                                    size={64}
                                                    className="mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                                                    style={{ color: isDragging ? '#7A1E2D' : '#1F3A5F' }}
                                                />
                                                <p className="text-base font-semibold mb-2" style={{ color: '#2E2E2E' }}>
                                                    {isDragging ? '¡Suelta aquí!' : 'Arrastra tu constancia o haz clic'}
                                                </p>
                                                <p className="text-sm" style={{ color: 'rgba(46, 46, 46, 0.6)' }}>
                                                    PDF hasta 5MB
                                                </p>
                                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                                                    style={{ backgroundColor: 'rgba(31, 58, 95, 0.1)' }}>
                                                    <AiOutlineSafety style={{ color: '#1F3A5F' }} />
                                                    <span style={{ color: '#1F3A5F' }}>Archivo seguro</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {errors.constanciaEstudios && (
                                    <p className="mt-2 text-sm flex items-center gap-1" style={{ color: '#D32F2F' }}>
                                        <span>⚠️</span> {errors.constanciaEstudios}
                                    </p>
                                )}

                                <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
                                        borderLeft: '4px solid #FFC107'
                                    }}>
                                    <span className="text-xl">💡</span>
                                    <p className="text-sm" style={{ color: '#2E2E2E' }}>
                                        <span className="font-semibold">Tip:</span> Asegúrate de que tu constancia esté vigente, sea legible y contenga tu nombre completo.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error de envío */}
                        {errors.submit && (
                            <div className="p-4 rounded-xl flex items-center gap-3 animate-shake"
                                style={{
                                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                    border: '1px solid rgba(211, 47, 47, 0.2)'
                                }}>
                                <span className="text-2xl">❌</span>
                                <p className="text-sm font-medium" style={{ color: '#D32F2F' }}>
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        {/* Botón de envío */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full text-white font-semibold py-5 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-3 group relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #7A1E2D 0%, #621823 100%)',
                                    boxShadow: '0 8px 20px rgba(122, 30, 45, 0.3)',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    opacity: isLoading ? 0.8 : 1
                                }}
                            >
                                {/* Efecto de brillo */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: 'radial-gradient(circle at 50% -50%, rgba(255, 255, 255, 0.3), transparent 70%)'
                                    }} />

                                {isLoading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Completando perfil...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Completar Perfil</span>
                                        <AiOutlineArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>

                            <p className="text-center mt-4 text-sm" style={{ color: 'rgba(46, 46, 46, 0.5)' }}>
                                Tus datos están protegidos y solo se usarán para verificar tu identidad
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                .border-3 {
                    border-width: 3px;
                }
            `}</style>
        </div>
    );
}

export default FormMain;