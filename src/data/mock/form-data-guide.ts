export const FORM_DATA_GUIDE = {
  identification: {
    description: "Datos de identificación personal del solicitante",
    fields: {
      firstName: {
        type: "string",
        required: true,
        description: "Nombre(s) completo(s) del solicitante",
        example: "Juan",
      },
      lastName: {
        type: "string",
        required: true,
        description: "Apellidos completos (paterno y materno)",
        example: "Pérez González",
      },
      age: {
        type: "string",
        required: true,
        description: "Edad actual del solicitante",
        example: "17",
      },
      birthDate: {
        type: "string",
        required: true,
        description: "Fecha de nacimiento en formato YYYY-MM-DD",
        example: "2008-03-15",
      },
      gender: {
        type: "string",
        required: true,
        description: "Género del solicitante",
        example: "masculino",
        options: ["masculino", "femenino", "otro", "prefiero no decir"],
      },
      maritalStatus: {
        type: "string",
        required: true,
        description: "Estado civil",
        example: "soltero",
        options: ["soltero", "casado", "divorciado", "viudo"],
      },
      address: {
        type: "object",
        required: true,
        description: "Coordenadas de ubicación (latitud y longitud)",
        fields: {
          lat: { type: "number", description: "Latitud", example: 19.4326 },
          lng: { type: "number", description: "Longitud", example: -99.1332 },
        },
      },
      phone: {
        type: "string",
        required: true,
        description: "Teléfono de contacto (formato: XX XXXX XXXX)",
        example: "55 1234 5678",
      },
      email: {
        type: "string",
        required: true,
        description: "Correo electrónico válido",
        example: "juan.perez@email.com",
      },
      bloodType: {
        type: "string",
        required: true,
        description: "Tipo de sangre",
        example: "O+",
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "desconocido"],
      },
      medicalConditions: {
        type: "string",
        required: false,
        description: "Condiciones médicas existentes",
        example: "Ninguna",
      },
      allergies: {
        type: "string",
        required: false,
        description: "Alergias conocidas",
        example: "Polen",
      },
      medications: {
        type: "string",
        required: false,
        description: "Medicamentos actuales",
        example: "Ninguno",
      },
    },
  },

  school: {
    description: "Datos de la escuela de procedencia",
    fields: {
      name: {
        type: "string",
        required: true,
        description: "Nombre completo de la institución educativa",
        example: "Escuela Preparatoria Federal #3",
      },
      location: {
        type: "string",
        required: true,
        description: "Ciudad y/o estado donde se encuentra la escuela",
        example: "Ciudad de México",
      },
      knowledgeArea: {
        type: "string",
        required: true,
        description: "Área de conocimiento o especialización",
        example: "Ciencias",
        options: ["Ciencias", "Humanidades", "Ingeniería", "Ciencias de la Salud", "Artes", "Economía"],
      },
      enrollmentYear: {
        type: "number",
        required: true,
        description: "Año de ingreso a la escuela",
        example: 2022,
      },
      graduationYear: {
        type: "number",
        required: true,
        description: "Año de graduación o egreso",
        example: 2025,
      },
      finalAverage: {
        type: "number",
        required: true,
        description: "Promedio final de estudios (0-10)",
        example: 9.2,
        range: "0-10",
      },
      certificateFolio: {
        type: "string",
        required: true,
        description: "Número de folio del certificado",
        example: "12345/2025",
      },
      schoolType: {
        type: "string",
        required: true,
        description: "Tipo de institución educativa",
        example: "bachillerato",
        options: ["bachillerato", "preparatoria", "licenciatura", "tecnico"],
      },
      certificate: {
        type: "File",
        required: false,
        description: "Archivo PDF del certificado de estudios",
      },
    },
  },

  personalDocumentation: {
    description: "Documentación personal requerida",
    fields: {
      birthCertificate: {
        type: "File",
        required: true,
        description: "Acta de nacimiento (PDF/JPG/PNG)",
      },
      highSchoolCertificate: {
        type: "File",
        required: true,
        description: "Certificado de estudios de secundaria (PDF/JPG/PNG)",
      },
      highSchoolProof: {
        type: "File",
        required: true,
        description: "Constancia de estudios de preparatoria (PDF/JPG/PNG)",
      },
      curp: {
        type: "File",
        required: true,
        description: "Documento CURP (PDF/JPG/PNG)",
      },
      photos: {
        type: "File",
        required: true,
        description: "Fotografías recientes (JPEG/PNG)",
      },
    },
  },

  applicant: {
    description: "Datos del solicitante (información adicional de salud)",
    fields: {
      bloodType: {
        type: "string",
        required: true,
        description: "Tipo de sangre",
        example: "O+",
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      diseases: {
        type: "array",
        required: false,
        description: "Enfermedades padecidas o actuales",
        example: [],
        options: ["diabetes", "hipertension", "asma", "epilepsia", "ninguna"],
      },
      diseasesDetails: {
        type: "string",
        required: false,
        description: "Detalles específicos de las enfermedades",
        example: "",
      },
      allergies: {
        type: "array",
        required: false,
        description: "Alergias",
        example: ["polen"],
        options: ["polen", "alimentos", "medicamentos", "latex", "ninguna"],
      },
      allergiesDetails: {
        type: "string",
        required: false,
        description: "Detalles de las alergias",
        example: "Alergia estacional leve",
      },
      specialMedications: {
        type: "array",
        required: false,
        description: "Medicamentos especiales",
        example: [],
      },
      medicationsDetails: {
        type: "array",
        required: false,
        description: "Detalles de medicamentos",
        example: [],
      },
      disability: {
        type: "array",
        required: false,
        description: "Discapacidades",
        example: [],
        options: ["visual", "auditiva", "motriz", "cognitiva", "ninguna"],
      },
      disabilityDetails: {
        type: "string",
        required: false,
        description: "Detalles de la discapacidad",
        example: "",
      },
      indigenous: {
        type: "array",
        required: true,
        description: "Pertenencia a pueblo indígena",
        example: ["no"],
        options: ["si", "no"],
      },
      ethnicGroup: {
        type: "string",
        required: false,
        description: "Grupo étnico (si aplica)",
        example: "",
        options: ["Nahua", "Maya", "Zapoteca", "Mixteca", "P'urhépecha", "Otomi", "Otro"],
      },
      indigenousLanguage: {
        type: "array",
        required: false,
        description: "Lenguas indígenas que habla",
        example: [],
      },
      languageDetails: {
        type: "array",
        required: false,
        description: "Detalles sobre las lenguas",
        example: [],
      },
      afrodescendant: {
        type: "string",
        required: true,
        description: "Descendencia afroamericana",
        example: "no",
        options: ["si", "no"],
      },
    },
  },

  responsible: {
    description: "Datos del padre, madre o tutor responsable",
    fields: {
      name: {
        type: "string",
        required: true,
        description: "Nombre(s) del responsable",
        example: "María Elena",
      },
      lastName: {
        type: "string",
        required: true,
        description: "Apellidos del responsable",
        example: "González Rodríguez",
      },
      relationShip: {
        type: "string",
        required: true,
        description: "Parentesco con el solicitante",
        example: "madre",
        options: ["padre", "madre", "tutor", "abuelo", "otro"],
      },
      address: {
        type: "object",
        required: true,
        description: "Coordenadas de ubicación del responsable",
        fields: {
          lat: { type: "number", description: "Latitud", example: 19.4326 },
          lng: { type: "number", description: "Longitud", example: -99.1332 },
        },
      },
      occupation: {
        type: "string",
        required: true,
        description: "Ocupación o profesión",
        example: "Enfermera",
      },
      phone: {
        type: "string",
        required: true,
        description: "Teléfono de contacto del responsable",
        example: "55 9876 5432",
      },
    },
  },
} as const;

export type FormDataGuide = typeof FORM_DATA_GUIDE;