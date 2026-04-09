# Casos de Uso - Sistema de Registro de Token

## Matriz de Casos de Uso

| IDCaso_uso | Descripcion | Resultado esperado | Datos de entrada | Datos de salida | Status |
|------------|-------------|--------------------|-------------------|------------------|--------|
| **CU-01** | **Registro de Solicitud de Token**: El usuario completa el formulario de identificación personal incluyendo nombre, apellido, fecha de nacimiento, género, estado civil, ubicación geográfica, contacto telefónico y correo electrónico. El sistema valida que todos los campos requeridos estén presentes y correctamente formateados. | El sistema guarda los datos de identificación en el estado del formulario y permite avanzar al siguiente paso. Retorna confirmación de validación exitosa. | `{ identification: { firstName: string, lastName: string, age: string, birthDate: string, gender: string, maritalStatus: string, address: { lat: number, lng: number }, phone: string, email: string, bloodType: string, medicalConditions: string, allergies: string, medications: string } }` | `{ success: boolean, step: "identification", errors: [] }` | Completado |
| **CU-02** | **Registro de Información Escolar**: El usuario ingresa los datos de la institución educativa de procedencia, incluyendo nombre, ubicación, área de conocimiento, años de estudio, promedio final, folio del certificado y tipo de escuela. El sistema verifica la consistencia de las fechas y el rango del promedio. | El sistema valida y almacena la información escolar, confirmando el registro y habilitando la sección de documentación. | `{ school: { name: string, location: string, knowledgeArea: string, enrollmentYear: number, graduationYear: number, finalAverage: number, certificateFolio: string, schoolType: string, certificate?: File } }` | `{ success: boolean, step: "school", validated: true }` | Completado |
| **CU-03** | **Subida de Documentación Personal**: El usuario adjunta los archivos requeridos: acta de nacimiento, certificado de secundaria, constancia de preparatoria, documento CURP y fotografías. El sistema valida el formato, tamaño y calidad de cada archivo. | El sistema confirma la recepción de cada documento, almacena las referencias y muestra el progreso de documentación. | `{ personalDocumentation: { birthCertificate: File, highSchoolCertificate: File, highSchoolProof: File, curp: File, photos: File } }` | `{ success: boolean, documents: { birthCertificate: { uploaded: boolean, valid: boolean }, ... }, totalProgress: number }` | Completado |
| **CU-04** | **Registro de Información del Aspirante**: El usuario proporciona datos adicionales sobre salud: tipo de sangre, enfermedades, alergias, medicamentos especiales, discapacidades, origen étnico y lengua indígena. El sistema categoriza y procesa esta información sensible. | El sistema almacena la información de salud del aspirante, generando un perfil de necesidades especiales si aplica. | `{ applicant: { bloodType: string, diseases: string[], diseasesDetails: string, allergies: string[], allergiesDetails: string, specialMedications: string[], medicationsDetails: string[], disability: string[], disabilityDetails: string, indigenous: string[], ethnicGroup: string, indigenousLanguage: string[], languageDetails: string[], afrodescendant: string } }` | `{ success: boolean, healthProfile: { riskLevel: "bajo" | "medio" | "alto", specialNeeds: boolean, accommodations: string[] } }` | Completado |
| **CU-05** | **Registro de Datos del Responsable**: El usuario ingresa la información del padre, madre o tutor responsable: nombre completo, parentesco, ocupación, teléfono y dirección. El sistema verifica la consistencia con los datos del aspirante. | El sistema valida y guarda los datos del responsable, confirmando la completitud del registro. | `{ responsible: { name: string, lastName: string, relationShip: string, address: { lat: number, lng: number }, occupation: string, phone: string } }` | `{ success: boolean, validated: true, contactEnabled: true }` | Completado |
| **CU-06** | **Envío Completo del Formulario**: El usuario habiendo completado todas las secciones (identificación, escuela, documentación, aspirante, responsable) confirma el envío. El sistema realiza una validación final de todos los campos, genera un token único de registro y confirma la recepción. | El sistema genera el token de registro, envía confirmación por correo electrónico y muestra pantalla de éxito. | `{ identification: {...}, school: {...}, personalDocumentation: {...}, applicant: {...}, responsible: {...} }` | `{ token: string, status: "registrado", submissionDate: timestamp, confirmationEmail: sent }` | Completado |
| **CU-07** | **Validación de Documentación**: El sistema verifica automáticamente cada documento subido: formato (PDF/JPG/PNG), tamaño máximo (5MB), legibilidad y contenido esperado. Detecta documentos corruptos o inválidos. | El sistema retorna el estado de validación de cada documento, permitiendo al usuario corregir antes del envío final. | `{ documents: File[] }` | `{ validationResults: [{ document: string, valid: boolean, errors: string[], warning: string }] }` | En progreso |
| **CU-08** | **Verificación de Coherencia de Datos**: El sistema compara los datos entre secciones (ej: edad vs año de nacimiento, teléfono del responsable vs ubicación) para detectar inconsistencias y errores lógicos. | El sistema genera un reporte de coherencia con advertencias o errores que deben corregirse antes del envío. | `{ allFormData: IFormGetToken }` | `{ coherenceReport: { matches: boolean, warnings: [], inconsistencies: [] } }` | Pendiente |

---

## Resumen de Estado

| Estado | Cantidad |
|--------|----------|
| Completado | 5 |
| En progreso | 1 |
| Pendiente | 2 |
| **Total** | **8** |

---

## Notas

- Los casos de uso CU-01 a CU-06 representan el flujo principal del usuario
- Los casos CU-07 y CU-08 son procesos automáticos de validación del sistema
- Las estructuras de datos siguen el schema definido en `IFormGetToken`