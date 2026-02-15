// frontend/src/data/academicData.js

/**
 * Datos académicos del IPN
 * Estructura adaptable para facilitar actualizaciones
 */

export const EDUCATION_LEVELS = {
  MEDIO_SUPERIOR: 'medio_superior',
  SUPERIOR: 'superior'
};

export const EDUCATION_LEVEL_LABELS = {
  [EDUCATION_LEVELS.MEDIO_SUPERIOR]: 'Nivel Medio Superior',
  [EDUCATION_LEVELS.SUPERIOR]: 'Nivel Superior'
};

// Escuelas de Nivel Medio Superior
export const ESCUELAS_MEDIO_SUPERIOR = [
  {
    id: 'cecyt_1',
    nombre: 'CECyT 1 "Gonzalo Vázquez Vela"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_2',
    nombre: 'CECyT 2 "Miguel Bernard"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_3',
    nombre: 'CECyT 3 "Estanislao Ramírez Ruiz"',
    ubicacion: 'Estado de México'
  },
  {
    id: 'cecyt_4',
    nombre: 'CECyT 4 "Lázaro Cárdenas',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_5',
    nombre: 'CECyT 5 "Benito Juárez"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_6',
    nombre: 'CECyT 6 "Miguel Othón de Mendizábal"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_7',
    nombre: 'CECyT 7 "Cuauhtémoc"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_8',
    nombre: 'CECyT 8 "Narciso Bassols"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_9',
    nombre: 'CECyT 9 "Juan de Dios Bátiz"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_10',
    nombre: 'CECyT 10 "Carlos Vallejo Márquez"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_11',
    nombre: 'CECyT 11 "Wilfrido Massieu Pérez"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_12',
    nombre: 'CECyT 12 "José María Morelos"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_13',
    nombre: 'CECyT 13 "Ricardo Flores Magón"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_14',
    nombre: 'CECyT 14 "Luis Enrique Erro"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_15',
    nombre: 'CECyT 15 "Diodoro Antúnez Echegaray"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_16',
    nombre: 'CECyT 16 "Hidalgo"',
    ubicacion: 'Hidalgo'
  },
  {
    id: 'cecyt_17',
    nombre: 'CECyT 17 "León, Guanajuato"',
    ubicacion: 'Guanajuato'
  },
  {
    id: 'cecyt_18',
    nombre: 'CECyT 18 "Zacatecas"',
    ubicacion: 'Zacatecas'
  },
  {
    id: 'cecyt_19',
    nombre: 'CECyT 19 "Leona Vicario"',
    ubicacion: 'Estado de México'
  },
  {
    id: 'cet_1',
    nombre: 'CET 1 "Walter Cross Buchanan"',
    ubicacion: 'Ciudad de México'
  }
];

// Escuelas de Nivel Superior
export const ESCUELAS_SUPERIOR = [
  {
    id: 'esia_ticoman',
    nombre: 'ESIA Unidad Ticomán',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esia_zacatenco',
    nombre: 'ESIA Unidad Zacatenco',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esia_tecamachalco',
    nombre: 'ESIA Unidad Tecamachalco',
    ubicacion: 'Puebla'
  },
  {
    id:'esime_ticoman',
    nombre: 'ESIME Unidad Ticomán',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esime_zacatenco',
    nombre: 'ESIME Unidad Zacatenco',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esime_culhuacan',
    nombre: 'ESIME Unidad Culhuacán',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esime_azcapotzalco',
    nombre: 'ESIME Unidad Azcapotzalco',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'upiig_guanajuato',
    nombre: 'UPIIG Campus Guanajuato',
    ubicacion: 'Guanajuato'
  },
  {
    id: 'upibi',
    nombre: 'UPIBI',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'upiiz_zacatecas',
    nombre: 'UPIIZ Campus Zacatecas',
    ubicacion: 'Zacatecas'
  },
  {
    id: 'upiita',
    nombre: 'UPIITA',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'encb_zacatenco',
    nombre: 'ENCB Campus Zacatenco',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'encb_santo_tomas',
    nombre: 'ENCB Campus Santo Tomás',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'upiip_palenque',
    nombre: 'UPIIP Campus Palenque',
    ubicacion: 'Chiapas'
  },
  {
    id: 'upiit_tlaxcala',
    nombre: 'UPIIT Campus Tlaxcala',
    ubicacion: 'Tlaxcala'
  },
  {
    id: 'upiicsa',
    nombre: 'UPIICSA',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'escom',
    nombre: 'ESCOM',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esiqie',
    nombre: 'ESIQIE',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'upiem',
    nombre: 'UPIEM',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'upiih_hidalgo',
    nombre: 'UPIIH Campus Hidalgo',
    ubicacion: 'Hidalgo'
  },
  {
    id: 'esfm',
    nombre: 'ESFM',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esit',
    nombre: 'ESIT',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cics_milpa_alta',
    nombre: 'CICS Unidad Milpa Alta',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'eseo',
    nombre: 'ESEO',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cics_santo_tomas',
    nombre: 'CICS Unidad Santo Tomás',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'enmyh',
    nombre: 'ENMyH',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esm',
    nombre: 'ESM',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esca_santo_tomas',
    nombre: 'ESCA Unidad Santo Tomás',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'esca_tepepan',
    nombre: 'ESCA Unidad Tepepan',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'enba',
    nombre: 'ENBA',
    ubicacion: 'Ciudad de México'
  },
  {
    id:'ese',
    nombre: 'ESE',
    ubicacion: 'Ciudad de México'
  },
  {
    id:'est',
    nombre: 'EST',
    ubicacion: 'Ciudad de México'
  }
];

// Carreras Técnicas (Nivel Medio Superior)
export const CARRERAS_TECNICAS = {
  cecyt_1: [
    {id: 'construccion', nombre: 'Técnico en Construcción'},
    {id: 'mecatronica', nombre: 'Técnico en Mecatrónica'},
    {id: 'procesos_industriales', nombre: 'Técnico en Procesos Industriales'},
    {id: 'sistemas_de_control_electrico', nombre: 'Técnico en Sistemas de Control Eléctrico'},
    {id: 'sistemas_digitales', nombre: 'Técnico en Sistemas Digitales'}
  ],
  cecyt_2: [
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'dibujo_asistido_por_computadora', nombre: 'Técnico en Dibujo Asistido por Computadora'},
    {id: 'diseño_grafico_digital', nombre: 'Técnico en Diseño Gráfico Digital'},
    {id: 'maquinas_con_sistemas_automatizados', nombre: 'Técnico en Máquinas con Sistemas Automatizados'},
    {id: 'mecatronica', nombre: 'Técnico en Mecatrónica'},
    {id: 'metalurgia', nombre: 'Técnico en Metalurgia'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'}
  ],
  cecyt_3: [
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'computacion', nombre: 'Técnico en Computación'},
    {id: 'manufactura_asistida_por_computadora', nombre: 'Técnico en Manufactura Asistida por Computadora'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
    {id: 'sistemas_de_control_electrico', nombre: 'Técnico en Sistemas de Control Eléctrico'},
    {id: 'sistemas_digitales', nombre: 'Técnico en Sistemas Digitales'}
  ],
  cecyt_4: [
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'construccion', nombre: 'Técnico en Construcción'},
    {id: 'instalaciones_y_mantenimiento_electrico', nombre: 'Técnico en Instalaciones y Mantenimiento Eléctrico'},
    {id: 'procesos_industriales', nombre: 'Técnico en Procesos Industriales'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
  ],
  cecyt_5: [
    {id: 'comercio_internacional', nombre: 'Técnico en Comercio Internacional'},
    {id: 'contaduria', nombre: 'Técnico en Contaduría'},
    {id: 'informatica', nombre: 'Técnico en Informática'},
  ],
  cecyt_6: [
    {id: 'ecologia', nombre: 'Técnico en Ecología'},
    {id: 'enfermeria', nombre: 'Técnico en Enfermería'},
    {id: 'laboratorista_clinico', nombre: 'Técnico Laboratorista Clínico'},
    {id: 'laboratorista_quimico', nombre: 'Técnico Laboratorista Químico'},
    {id: 'nutricion', nombre: 'Técnico en Nutrición Humana'},
    {id: 'quimico_farmaceutico', nombre: 'Técnico Químico Farmacéutico'}
  ],
  cecyt_7: [
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'construccion', nombre: 'Técnico en Construcción'},
    {id: 'energia_sustentable', nombre: 'Técnico en Energía Sustentable'},
    {id: 'instalaciones_y_mantenimiento_electrico', nombre: 'Técnico en Instalaciones y Mantenimiento Eléctrico'},
    {id: 'mantenimiento', nombre: 'Técnico en Mantenimiento Industrial'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
    {id: 'soldadura_industrial', nombre: 'Técnico en Soldadura Industrial'}
  ],
  cecyt_8: [
    {id: 'computacion', nombre: 'Técnico en Computación'},
    {id: 'mantenimiento', nombre: 'Técnico en Mantenimiento Industrial'},
    {id: 'plasticos', nombre: 'Técnico en Plásticos'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
  ],
  cecyt_9: [
    {id: 'desarrollo_software', nombre: 'Técnico en Desarrollo de Software'},
    {id: 'mecatronica', nombre: 'Técnico en Mecatrónica'},
    {id: 'programacion', nombre: 'Técnico en Programación'},
    {id: 'sistemas_digitales', nombre: 'Técnico en Sistemas Digitales'},
  ],
  cecyt_10:[
    {id: 'diagnostico_y_mejoramiento_ambiental', nombre: 'Técnico en Diagnóstico y Mejoramiento Ambiental'},
    {id: 'mecatronica', nombre: 'Técnico en Mecatrónica'},
    {id: 'metrologia_y_control_de_calidad', nombre: 'Técnico en Metrología y Control de Calidad'},
    {id: 'telecomunicaciones', nombre: 'Técnico en Telecomunicaciones'}
  ],
  cecyt_11: [
    {id: 'construccion', nombre: 'Técnico en Construcción'},
    {id: 'energia_sustentable', nombre: 'Técnico en Energía Sustentable'},
    {id: 'instalaciones_y_mantenimiento_electrico', nombre: 'Técnico en Instalaciones y Mantenimiento Eléctrico'},
    {id: 'procesos_industriales', nombre: 'Técnico en Procesos Industriales'},
    {id: 'telecomunicaciones', nombre: 'Técnico en Telecomunicaciones'}
  ],
  cecyt_12: [
    {id: 'administracion', nombre: 'Técnico en Administración'},
    {id: 'contaduria', nombre: 'Técnico en Contaduría'},
    {id: 'informatica', nombre: 'Técnico en Informática'},
    {id: 'mercadotecnia_digital', nombre: 'Técnico en Mercadotecnia Digital'}
  ],
  cecyt_13: [
    {id: 'administracion', nombre: 'Técnico en Administración'},
    {id: 'administracion_empresas_turisticas', nombre: 'Técnico en Administración de Empresas Turísticas'},
    {id: 'contaduria', nombre: 'Técnico en Contaduría'},  
    {id: 'gastronomia', nombre: 'Técnico en Gastronomía'},
    {id: 'gestion_ciberseguridad', nombre: 'Técnico en Gestión de la Ciberseguridad'},
    {id: 'informatica', nombre: 'Técnico en Informática'}
  ],
  cecyt_14: [
    {id: 'administracion_recursos_humanos', nombre: 'Técnico en Administración de Recursos Humanos'},
    {id: 'contaduria', nombre: 'Técnico en Contaduría'},
    {id: 'informatica', nombre: 'Técnico en Informática'},
    {id: 'mercadotecnia', nombre: 'Técnico en Mercadotecnia'},
    {id: 'mercadotecnia_digital', nombre: 'Técnico en Mercadotecnia Digital'}
  ],
  cecyt_15: [
    {id: 'alimentos', nombre: 'Técnico en Alimentos'},
    {id: 'laboratorista_clinico', nombre: 'Técnico en Laboratorista Clínico'},
    {id: 'nutricion_humana', nombre: 'Técnico en Nutrición Humana'},
    {id: 'sustentabilidad', nombre: 'Técnico en Sustentabilidad'}
  ],
  cecyt_16: [
    {id: 'enfermeria', nombre: 'Técnico en Enfermería'},
    {id: 'laboratorista_clinico', nombre: 'Técnico en Laboratorista Clínico'},
    {id: 'administracion', nombre: 'Técnico en Administración'},
    {id: 'comercio_internacional', nombre: 'Técnico en Comercio Internacional'},
    {id: 'mantenimiento_industrial', nombre: 'Técnico en Mantenimiento Industrial'},
    {id: 'maquinas_sistemas_automatizados', nombre: 'Técnico en Máquinas con Sistemas Automatizados'},
    {id: 'procesos_industriales', nombre: 'Técnico en Procesos Industriales'}
  ],
  cecyt_17:[
    {id: 'administracion_empresas_turisticas', nombre: 'Técnico en Administración de Empresas Turísticas'}, 
    {id: 'comercio_internacional', nombre: 'Técnico en Comercio Internacional'},
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'metrologia_control_calidad', nombre: 'Técnico en Metrología y Control de Calidad'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
    {id: 'alimentos', nombre: 'Técnico en Alimentos'}
  ],
  cecyt_18:[
    {id: 'laboratorista_quimico', nombre: 'Técnico Laboratorista Químico'},
    {id: 'mantenimiento_industrial', nombre: 'Técnico en Mantenimiento Industrial'},
    {id: 'sistemas_digitales', nombre: 'Técnico en Sistemas Digitales'}
  ],
  cecyt_19:[
    {id: 'aeronautica', nombre: 'Técnico en Aeronáutica'},
    {id: 'construccion', nombre: 'Técnico en Construcción'},
    {id: 'alimentos', nombre: 'Técnico en Alimentos'}
  ],
  cet_1:[
    {id: 'automatizacion_control_electrico_industrial', nombre: 'Técnico en Automatización y Control Eléctrico Industrial'},
    {id: 'redes_de_computo', nombre: 'Técnico en Redes de Cómputo'},
    {id: 'sistemas_automotrices', nombre: 'Técnico en Sistemas Automotrices'},
    {id: 'sistemas_computacionales', nombre: 'Técnico en Sistemas Computacionales'},
    {id: 'sistemas_constructivos_asistidos_por_computadora', nombre: 'Técnico en Sistemas Constructivos Asistidos por Computadora'},
    {id: 'sistemas_mecanicos_industriales', nombre: 'Técnico en Sistemas Mecánicos Industriales'}
  ]
};

// Carreras Universitarias (Nivel Superior)
export const CARRERAS_UNIVERSITARIAS = {
  
};

/**
 * Obtener carreras según nivel educativo y escuela
 */
export const getCarrerasByEscuela = (nivelEducativo, escuelaId) => {
  if (nivelEducativo === EDUCATION_LEVELS.MEDIO_SUPERIOR) {
    return CARRERAS_TECNICAS[escuelaId] || [];
  } else if (nivelEducativo === EDUCATION_LEVELS.SUPERIOR) {
    return CARRERAS_UNIVERSITARIAS[escuelaId] || [];
  }
  return [];
};

/**
 * Obtener escuelas según nivel educativo
 */
export const getEscuelasByNivel = (nivelEducativo) => {
  if (nivelEducativo === EDUCATION_LEVELS.MEDIO_SUPERIOR) {
    return ESCUELAS_MEDIO_SUPERIOR;
  } else if (nivelEducativo === EDUCATION_LEVELS.SUPERIOR) {
    return ESCUELAS_SUPERIOR;
  }
  return [];
};