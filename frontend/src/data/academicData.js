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
    id: 'cet_1',
    nombre: 'CET 1 "Walter Cross Buchanan"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_2',
    nombre: 'CECyT 2 "Miguel Bernard Perales"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_3',
    nombre: 'CECyT 3 "Estanislao Ramírez Ruiz"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_5',
    nombre: 'CECyT 5 "Benito Juárez García"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_9',
    nombre: 'CECyT 9 "Juan de Dios Bátiz Paredes"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_11',
    nombre: 'CECyT 11 "Wilfrido Massieu Pérez"',
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'cecyt_13',
    nombre: 'CECyT 13 "Ricardo Flores Magón"',
    ubicacion: 'Ciudad de México'
  }
];

// Escuelas de Nivel Superior
export const ESCUELAS_SUPERIOR = [
  {
    id: 'esime_zacatenco',
    nombre: 'ESIME Zacatenco',
    ubicacion: 'Zacatenco'
  },
  {
    id: 'escom',
    nombre: 'ESCOM - Escuela Superior de Cómputo',
    ubicacion: 'Zacatenco'
  },
  {
    id: 'esiqie',
    nombre: 'ESIQIE - Escuela Superior de Ingeniería Química e Industrias Extractivas',
    ubicacion: 'Zacatenco'
  },
  {
    id: 'esca_tepepan',
    nombre: 'ESCA Tepepan',
    ubicacion: 'Tepepan'
  },
  {
    id: 'esia_zacatenco',
    nombre: 'ESIA Zacatenco',
    ubicacion: 'Zacatenco'
  },
  {
    id: 'upiicsa',
    nombre: 'UPIICSA',
    ubicacion: 'Iztacalco'
  },
  {
    id: 'upiita',
    nombre: 'UPIITA',
    ubicacion: 'Ticomán'
  },
  {
    id: 'encb',
    nombre: 'ENCB - Escuela Nacional de Ciencias Biológicas',
    ubicacion: 'Zacatenco'
  }
];

// Carreras Técnicas (Nivel Medio Superior)
export const CARRERAS_TECNICAS = {
  cet_1: [
    { id: 'construccion', nombre: 'Técnico en Construcción' },
    { id: 'topografia', nombre: 'Técnico en Topografía' }
  ],
  cecyt_2: [
    { id: 'sistemas_digitales', nombre: 'Técnico en Sistemas Digitales' },
    { id: 'electricidad', nombre: 'Técnico en Electricidad Industrial' }
  ],
  cecyt_3: [
    { id: 'electronica', nombre: 'Técnico en Electrónica' },
    { id: 'telecomunicaciones', nombre: 'Técnico en Telecomunicaciones' }
  ],
  cecyt_5: [
    { id: 'laboratorista_quimico', nombre: 'Técnico Laboratorista Químico' },
    { id: 'industria_alimentaria', nombre: 'Técnico en Industria Alimentaria' }
  ],
  cecyt_9: [
    { id: 'aeronautica', nombre: 'Técnico en Aeronáutica' },
    { id: 'mantenimiento', nombre: 'Técnico en Mantenimiento Industrial' }
  ],
  cecyt_11: [
    { id: 'informatica', nombre: 'Técnico en Informática' },
    { id: 'programacion', nombre: 'Técnico en Programación' }
  ],
  cecyt_13: [
    { id: 'instalaciones', nombre: 'Técnico en Instalaciones y Mantenimiento Eléctrico' },
    { id: 'sistemas_automatizados', nombre: 'Técnico en Sistemas Automatizados' }
  ]
};

// Carreras Universitarias (Nivel Superior)
export const CARRERAS_UNIVERSITARIAS = {
  esime_zacatenco: [
    { id: 'ing_mecanica', nombre: 'Ingeniería Mecánica' },
    { id: 'ing_electrica', nombre: 'Ingeniería Eléctrica' },
    { id: 'ing_electronica', nombre: 'Ingeniería Electrónica' },
    { id: 'ing_control', nombre: 'Ingeniería en Control y Automatización' }
  ],
  escom: [
    { id: 'ing_sistemas', nombre: 'Ingeniería en Sistemas Computacionales' },
    { id: 'lic_ciencias_datos', nombre: 'Licenciatura en Ciencia de Datos' }
  ],
  esiqie: [
    { id: 'ing_quimica_industrial', nombre: 'Ingeniería Química Industrial' },
    { id: 'ing_quimica_petrolera', nombre: 'Ingeniería Química Petrolera' },
    { id: 'ing_metalurgica', nombre: 'Ingeniería Metalúrgica' }
  ],
  esca_tepepan: [
    { id: 'contador_publico', nombre: 'Contador Público' },
    { id: 'lic_administracion', nombre: 'Licenciatura en Administración Industrial' },
    { id: 'lic_negocios', nombre: 'Licenciatura en Negocios Internacionales' }
  ],
  esia_zacatenco: [
    { id: 'ing_civil', nombre: 'Ingeniería Civil' },
    { id: 'ing_topografica', nombre: 'Ingeniería Topográfica y Fotogramétrica' },
    { id: 'arquitectura', nombre: 'Arquitectura' }
  ],
  upiicsa: [
    { id: 'ing_industrial', nombre: 'Ingeniería Industrial' },
    { id: 'ing_informatica', nombre: 'Ingeniería Informática' },
    { id: 'ing_transporte', nombre: 'Ingeniería en Transporte' },
    { id: 'lic_administracion_ind', nombre: 'Licenciatura en Administración Industrial' }
  ],
  upiita: [
    { id: 'ing_mecatronica', nombre: 'Ingeniería Mecatrónica' },
    { id: 'ing_bioprocesos', nombre: 'Ingeniería en Bioprocesos' },
    { id: 'ing_telematica', nombre: 'Ingeniería Telemática' }
  ],
  encb: [
    { id: 'biologia', nombre: 'Biólogo' },
    { id: 'ing_bioquimica', nombre: 'Ingeniería Bioquímica' },
    { id: 'qfb', nombre: 'Químico Farmacéutico Biólogo' },
    { id: 'ing_farmaceutica', nombre: 'Ingeniería Farmacéutica' }
  ]
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