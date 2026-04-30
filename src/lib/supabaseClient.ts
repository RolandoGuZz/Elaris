import { createClient } from "@supabase/supabase-js";
import type { FormGetToken } from "../components/react/core/types/IFormGetToken";
import type { IFormInscription } from "../components/react/core/types/IFormInscription";
import { normalizeCurp } from "../components/react/core/validations/utils/curp";

const supabaseUrl = "https://zseduawvdpcfmmllhfxk.supabase.co";
const supabaseAnonKey = "sb_publishable_ZR45adyxzbIx8YO1K6_npQ_E2Uoq_GH";
let supabaseInstance: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno.",
    );
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as unknown as Record<string, unknown>)[
      prop as string
    ];
    if (typeof value === "function") {
      return (value as Function).bind(client);
    }
    return value;
  },
});

const DOCUMENTS_BUCKET = "documents";
const INSCRIPTION_LEVELS = ["Primaria", "Secundaria", "Bachillerato"] as const;
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const AVERAGE_PATTERN = /^(?:[0-9]\.[0-9]|10\.0)$/;

const PERSONAL_DOCUMENT_TYPES = {
  birthCertificate: "Acta de Nacimiento",
  highSchoolProof: "Constancia de Bachillerato",
  curp: "Clave Única de Registro",
  photos: "Fotografía",
} satisfies Record<
  keyof FormGetToken["personalDocumentation"],
  string
>;

type UUID = string;

const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "");

const formatCoordinate = (value: number) => Number(value.toFixed(6));

const mapGenderToDb = (gender: string) => {
  if (gender === "Masculino") return "H";
  if (gender === "Femenino") return "M";
  return "X";
};

const splitLastNames = (
  rawLastName: string | null | undefined,
): {
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
} => {
  const normalized = rawLastName?.trim() ?? "";
  if (!normalized) {
    return { apellidoPaterno: null, apellidoMaterno: null };
  }

  const parts = normalized.split(/\s+/);
  const apellidoPaterno = parts.shift() ?? null;
  const apellidoMaterno = parts.length > 0 ? parts.join(" ") : null;

  return {
    apellidoPaterno: apellidoPaterno?.trim() || null,
    apellidoMaterno: apellidoMaterno?.trim() || null,
  };
};

const joinOrNull = (values?: string[]) => {
  if (!values || values.length === 0) return null;
  return values.join(", ");
};

const parseAverage = (value?: string | null): number | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!AVERAGE_PATTERN.test(normalized)) {
    return null;
  }
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
};

const findAlumnoByCurp = async (
  normalizedCurp: string,
): Promise<{ alumnoId: UUID; personaId: UUID } | null> => {
  const { data, error } = await supabase
    .from("alumno")
    .select("id_alumno, id_persona")
    .eq("curp", normalizedCurp)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Error al buscar la CURP ${normalizedCurp}: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    alumnoId: data.id_alumno as UUID,
    personaId: data.id_persona as UUID,
  };
};

const findPersonaIdByCurp = async (
  normalizedCurp: string,
): Promise<UUID | null> => {
  const alumno = await findAlumnoByCurp(normalizedCurp);
  return alumno?.personaId ?? null;
};

interface UbicacionInput {
  lat?: number | null;
  lng?: number | null;
  municipio?: string | null;
  estado?: string | null;
  calle?: string | null;
  numero?: string | null;
  colonia?: string | null;
  codigoPostal?: string | null;
  direccionCompleta?: string | null;
}

const insertUbicacion = async (input: UbicacionInput = {}): Promise<UUID> => {
  const latitud = formatCoordinate(input.lat ?? 0);
  const longitud = formatCoordinate(input.lng ?? 0);
  const municipio = input.municipio?.trim() || "Sin especificar";
  const estado = input.estado?.trim() || "Sin especificar";

  const { data, error } = await supabase
    .from("ubicacion")
    .insert({
      latitud,
      longitud,
      municipio,
      estado,
      calle: input.calle?.trim() || null,
      numero: input.numero?.trim() || null,
      colonia: input.colonia?.trim() || null,
      codigo_postal: input.codigoPostal?.trim() || null,
      direccion_completa: input.direccionCompleta?.trim() || null,
    })
    .select("id_ubicacion")
    .single();

  if (error) {
    throw new Error(`No se pudo registrar la ubicación: ${error.message}`);
  }

  return data.id_ubicacion as UUID;
};

const getCampusId = async (nombre: string): Promise<UUID> => {
  const { data, error } = await supabase
    .from("campus")
    .select("id_campus")
    .eq("nombre", nombre)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al buscar el campus "${nombre}": ${error.message}`);
  }

  if (!data) {
    throw new Error(`No se encontró el campus "${nombre}" en la base de datos`);
  }

  return data.id_campus as UUID;
};

const getCarreraId = async (nombre: string): Promise<UUID> => {
  const { data, error } = await supabase
    .from("carrera")
    .select("id_carrera")
    .eq("nombre", nombre)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al buscar la carrera "${nombre}": ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `No se encontró la carrera "${nombre}" en la base de datos`,
    );
  }

  return data.id_carrera as UUID;
};

const insertPersona = async (
  params: Partial<{
    nombre: string;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    id_ubicacion: UUID | null;
    fecha_nacimiento: string | null;
    telefono: string | null;
  }>,
): Promise<UUID> => {
  const payload = {
    nombre: params.nombre?.trim() || "Sin nombre",
    apellido_paterno: params.apellido_paterno ?? null,
    apellido_materno: params.apellido_materno ?? null,
    id_ubicacion: params.id_ubicacion ?? null,
    fecha_nacimiento: params.fecha_nacimiento ?? null,
    telefono: params.telefono ?? null,
  };

  const { data, error } = await supabase
    .from("persona")
    .insert(payload)
    .select("id_persona")
    .single();

  if (error) {
    throw new Error(
      `No se pudo crear el registro de persona: ${error.message}`,
    );
  }

  return data.id_persona as UUID;
};

const insertAlumno = async (
  params: {
    personaId: UUID;
    correo: string;
    curp: string;
    sexo: string | null;
    campusId: UUID;
    carreraId: UUID;
  },
): Promise<UUID> => {
  const payload = {
    id_persona: params.personaId,
    correo: params.correo.trim() || null,
    curp: params.curp.trim(),
    sexo: params.sexo ?? null,
    id_campus: params.campusId,
    id_carrera: params.carreraId,
  };

  const { data, error } = await supabase
    .from("alumno")
    .insert(payload)
    .select("id_alumno")
    .single();

  if (error) {
    throw new Error(`No se pudo crear el alumno: ${error.message}`);
  }

  return data.id_alumno as UUID;
};

const insertInfoMedica = async (
  idAlumno: UUID,
  tipoSangre: string,
  alergias: string | null,
) => {
  const { error } = await supabase.from("info_medica").insert({
    id_alumno: idAlumno,
    tipo_sangre: tipoSangre || null,
    alergias,
  });

  if (error) {
    throw new Error(
      `No se pudo guardar la información médica: ${error.message}`,
    );
  }
};

const getOrCreate = async (
  table: "enfermedad" | "lengua",
  idField: "id_enfermedad" | "id_lengua",
  nombre: string,
): Promise<UUID> => {
  const trimmed = nombre.trim();
  if (!trimmed) {
    throw new Error("El valor proporcionado está vacío");
  }

  const { data, error } = await supabase
    .from(table)
    .select(idField)
    .eq("nombre", trimmed)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al consultar ${table}: ${error.message}`);
  }

  if (data) {
    return data[idField] as UUID;
  }

  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert({ nombre: trimmed })
    .select(idField)
    .single();

  if (insertError) {
    throw new Error(
      `No se pudo registrar ${table.slice(0, -1)}: ${insertError.message}`,
    );
  }

  return inserted[idField] as UUID;
};

const insertAlumnoEnfermedad = async (idAlumno: UUID, idEnfermedad: UUID) => {
  const { error } = await supabase
    .from("alumno_enfermedad")
    .insert({ id_alumno: idAlumno, id_enfermedad: idEnfermedad });

  if (error && error.code !== "23505") {
    throw new Error(`No se pudo vincular la enfermedad: ${error.message}`);
  }
};

const insertAlumnoLengua = async (idAlumno: UUID, idLengua: UUID) => {
  const { error } = await supabase
    .from("alumno_lengua")
    .insert({ id_alumno: idAlumno, id_lengua: idLengua, nivel: null });

  if (error && error.code !== "23505") {
    throw new Error(`No se pudo vincular la lengua: ${error.message}`);
  }
};

const getEscuelaId = async (
  nombre: string,
  tipo: string,
  ubicacion?: { lat: number; lng: number } | null,
): Promise<UUID> => {
  const { data, error } = await supabase
    .from("escuela")
    .select("id_escuela")
    .eq("nombre", nombre)
    .eq("tipo", tipo)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al consultar la escuela: ${error.message}`);
  }

  if (data) {
    return data.id_escuela as UUID;
  }

  const ubicacionId = await insertUbicacion({
    lat: ubicacion?.lat ?? 0,
    lng: ubicacion?.lng ?? 0,
  });

  const { data: inserted, error: insertError } = await supabase
    .from("escuela")
    .insert({ nombre, tipo, id_ubicacion: ubicacionId })
    .select("id_escuela")
    .single();

  if (insertError) {
    throw new Error(`No se pudo registrar la escuela: ${insertError.message}`);
  }

  return inserted.id_escuela as UUID;
};

const insertEscolaridad = async (
  idAlumno: UUID,
  idEscuela: UUID,
  promedio: number,
  anioEgreso: number | null,
) => {
  const { error } = await supabase.from("escolaridad").insert({
    id_alumno: idAlumno,
    id_escuela: idEscuela,
    promedio,
    anio_egreso: anioEgreso,
  });

  if (error) {
    throw new Error(`No se pudo registrar la escolaridad: ${error.message}`);
  }
};

const insertDocumento = async (
  idAlumno: UUID,
  tipo: string,
  contenido: unknown,
) => {
  if (
    tipo === "curp_text" ||
    tipo === "contact_email" ||
    tipo === "responsable_info"
  ) {
    return;
  }

  if (contenido === undefined || contenido === null) return;
  const value =
    typeof contenido === "string" ? contenido : JSON.stringify(contenido);
  if (value.length === 0) return;

  const { error } = await supabase
    .from("documento")
    .insert({ id_alumno: idAlumno, tipo, url_archivo: value });

  if (error) {
    throw new Error(
      `No se pudo guardar el documento (${tipo}): ${error.message}`,
    );
  }
};

export const assertCurpNotRegistered = async (curp: string) => {
  const normalized = normalizeCurp(curp);
  const existingId = await findPersonaIdByCurp(normalized);
  if (existingId) {
    throw new Error(
      "La CURP ya está registrada en el sistema. No es posible obtener una ficha.",
    );
  }
};

const formatExamDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = MONTHS_ES[date.getMonth()];
  const year = date.getFullYear();
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${day} de ${month} de ${year} a las ${hours}:${minutes}`;
};

const sendAdmissionEmail = async (params: {
  email: string;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  curp: string;
  fechaExamenIso: string;
}) => {
  const {
    email,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    curp,
    fechaExamenIso,
  } = params;

  if (!email || !nombre || !curp || !fechaExamenIso) {
    throw new Error("No se pudo enviar el correo porque falta información.");
  }

  const fullName = `${nombre} ${apellidoPaterno ?? ""} ${apellidoMaterno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
  const fechaFormateada = formatExamDate(fechaExamenIso);

  const html = `
    <h2>Confirmación de registro</h2>
    <p>Hola ${fullName},</p>
    <p>Tu registro ha sido exitoso. Aquí están tus datos:</p>

    <ul>
      <li><strong>Nombre:</strong> ${fullName}</li>
      <li><strong>CURP:</strong> ${curp}</li>
      <li><strong>Fecha de examen:</strong> ${fechaFormateada}</li>
    </ul>

    <p>Por favor conserva este correo para futuras referencias.</p>

    <p>Éxito en tu proceso de admisión.</p>
  `;

  const anonKey = supabaseAnonKey;
  if (!anonKey) {
    throw new Error(
      "No se pudo enviar el correo porque falta VITE_SUPABASE_ANON_KEY.",
    );
  }

  const response = await fetch(
    "https://zseduawvdpcfmmllhfxk.supabase.co/functions/v1/resend-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        to: "teddiazdiaz019@gmail.com",
        subject: "Confirmación de ficha de admisión",
        html,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("No se pudo enviar el correo: " + errorText);
  }
};

const insertResponsable = async (
  idAlumno: UUID,
  payload: {
    name: string;
    lastName: string;
    birthDate: string;
    relationShip: string;
    occupation: string;
    phone: string;
    address?: { lat: number; lng: number } | null;
    email?: string | null;
  },
): Promise<{ responsableId: UUID; personaId: UUID }> => {
  const {
    apellidoPaterno: responsableApellidoPaterno,
    apellidoMaterno: responsableApellidoMaterno,
  } = splitLastNames(payload.lastName);

  const fullName =
    `${payload.name?.trim() ?? ""} ${payload.lastName?.trim() ?? ""}`.trim() ||
    "Responsable";

  let responsableLocationId: UUID | null = null;
  if (payload.address?.lat !== undefined && payload.address?.lng !== undefined) {
    responsableLocationId = await insertUbicacion({
      lat: payload.address.lat,
      lng: payload.address.lng,
    });
  }

  const responsablePersonaId = await insertPersona({
    nombre: fullName,
    apellido_paterno: responsableApellidoPaterno,
    apellido_materno: responsableApellidoMaterno,
    id_ubicacion: responsableLocationId,
    fecha_nacimiento: payload.birthDate ?? null,
    telefono: payload.phone ?? null,
  });

  const { data, error } = await supabase
    .from("responsable")
    .insert({
      id_persona: responsablePersonaId,
      parentesco: payload.relationShip ?? null,
      ocupacion: payload.occupation ?? null,
    })
    .select("id_responsable")
    .single();

  if (error) {
    throw new Error(
      `No se pudo guardar la información del responsable: ${error.message}`,
    );
  }

  const responsableId = data.id_responsable as UUID;

  const responsableInfo = {
    responsableId,
    birthDate: payload.birthDate ?? null,
    occupation: payload.occupation ?? null,
    location: payload.address ?? null,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
  };

  return { responsableId, personaId: responsablePersonaId };
};

const insertFicha = async (
  idAlumno: UUID,
  idCarrera: UUID,
  estado: string,
): Promise<UUID> => {
  const { data, error } = await supabase
    .from("ficha")
    .insert({
      id_alumno: idAlumno,
      id_carrera: idCarrera,
      estado,
    })
    .select("id_ficha")
    .single();

  if (error) {
    throw new Error(
      `No se pudo crear la ficha del aspirante: ${error.message}`,
    );
  }

  return data.id_ficha as UUID;
};

const getNextExamDate = (): string => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const dates = [
    new Date(currentYear, 4, 25, 10, 0, 0),
    new Date(currentYear, 5, 11, 10, 0, 0),
  ];

  for (const date of dates) {
    if (today <= date) {
      return date.toISOString().split("T")[0];
    }
  }

  const firstNextYear = new Date(currentYear + 1, 4, 25, 10, 0, 0);
  return firstNextYear.toISOString().split("T")[0];
};

const scheduleAdmissionExam = async (fichaId: UUID) => {
  const examDate = getNextExamDate();

  const { error } = await supabase.from("examen_admision").insert({
    id_ficha: fichaId,
    fecha: `${examDate}T10:00:00`,
    calificacion: null,
    resultado: null,
  });

  if (error) {
    throw new Error(
      `No se pudo asignar el examen de admisión: ${error.message}`,
    );
  }

  return `${examDate}T10:00:00`;
};

const insertInscriptionRecord = async (
  idAlumno: UUID,
  normalizedCurp: string,
  folioActa: string,
  registrarResponsable: boolean,
  idResponsable: UUID | null,
): Promise<UUID> => {
  const { data, error } = await supabase
    .from("inscripciones")
    .insert({
      id_alumno: idAlumno,
      curp: normalizedCurp,
      folio_acta_nacimiento: folioActa,
      registrar_responsable: registrarResponsable,
      id_responsable: idResponsable,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`No se pudo registrar la inscripción: ${error.message}`);
  }

  return data.id as UUID;
};

const insertInscripcionEscolaridad = async (
  idInscripcion: UUID,
  nivel: string,
  info: {
    nombre: string;
    lugarExpedicion: string;
    promedio: number;
    folio: string;
    urlCertificado: string | null;
    tipoInstitucion: string;
  },
) => {
  const { error } = await supabase.from("inscripcion_escolaridad").insert({
    id_inscripcion: idInscripcion,
    nivel,
    nombre_institucion: info.nombre,
    lugar_expedicion: info.lugarExpedicion,
    promedio: info.promedio,
    folio_certificado: info.folio,
    url_certificado: info.urlCertificado,
    tipo_institucion: info.tipoInstitucion,
  });

  if (error) {
    throw new Error(
      `No se pudo registrar la escolaridad de inscripción: ${error.message}`,
    );
  }
};

export const uploadFile = async (
  file: File,
  documentType: string,
): Promise<string> => {
  const safeDocumentType = documentType
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  const typeSegment = safeDocumentType || "otros";
  const sanitizedFileName = sanitizeFileName(file.name || "document");
  const uuid = crypto.randomUUID();
  const objectPath = `applicants/${typeSegment}/${uuid}-${sanitizedFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(objectPath);

  if (!publicUrl) {
    throw new Error("No fue posible obtener la URL pública del archivo");
  }

  return publicUrl;
};

export const saveApplicant = async (form: FormGetToken) => {
  try {
    await assertCurpNotRegistered(form.identification.curp);

    const campusId = await getCampusId(form.identification.campus);
    const carreraId = await getCarreraId(form.identification.career);
    const applicantLocationId = await insertUbicacion({
      lat: form.identification.address.lat,
      lng: form.identification.address.lng,
    });

    const {
      apellidoPaterno: applicantApellidoPaterno,
      apellidoMaterno: applicantApellidoMaterno,
    } = splitLastNames(form.identification.lastName);

    const applicantPersonaId = await insertPersona({
      nombre: form.identification.firstName.trim(),
      apellido_paterno: applicantApellidoPaterno,
      apellido_materno: applicantApellidoMaterno,
      id_ubicacion: applicantLocationId,
      fecha_nacimiento: form.identification.birthDate,
      telefono: form.identification.phone,
    });

    const applicantAlumnoId = await insertAlumno({
      personaId: applicantPersonaId,
      correo: form.identification.email,
      curp: form.identification.curp,
      sexo: mapGenderToDb(form.identification.gender),
      campusId,
      carreraId,
    });

    await insertInfoMedica(
      applicantAlumnoId,
      form.applicant.bloodType,
      joinOrNull(form.applicant.allergies),
    );

    const uniqueDiseases = Array.from(new Set(form.applicant.diseases || []));
    for (const disease of uniqueDiseases) {
      const idEnfermedad = await getOrCreate(
        "enfermedad",
        "id_enfermedad",
        disease,
      );
      await insertAlumnoEnfermedad(applicantAlumnoId, idEnfermedad);
    }

    const uniqueLanguages = Array.from(
      new Set(form.applicant.languageDetails || []),
    );
    for (const language of uniqueLanguages) {
      const idLengua = await getOrCreate("lengua", "id_lengua", language);
      await insertAlumnoLengua(applicantAlumnoId, idLengua);
    }

    const escuelaId = await getEscuelaId(
      form.school.name.trim(),
      form.school.schoolType.trim(),
      form.school.location,
    );

    const finalAverageValue = parseAverage(form.school.finalAverage);
    if (
      finalAverageValue !== null &&
      typeof form.school.graduationYear === "number" &&
      !Number.isNaN(form.school.graduationYear)
    ) {
      await insertEscolaridad(
        applicantAlumnoId,
        escuelaId,
        finalAverageValue,
        form.school.graduationYear,
      );
    }

    const personalDocumentsEntries = Object.entries(
      form.personalDocumentation,
    ) as [
      keyof FormGetToken["personalDocumentation"],
      FormGetToken["personalDocumentation"][keyof FormGetToken["personalDocumentation"]],
    ][];

    for (const [key, value] of personalDocumentsEntries) {
      const label = PERSONAL_DOCUMENT_TYPES[key];
      if (typeof value === "string" && value.trim().length > 0 && label) {
        await insertDocumento(applicantAlumnoId, label, value.trim());
      }
    }

    await insertResponsable(applicantAlumnoId, {
      name: form.responsible.name,
      lastName: form.responsible.lastName,
      birthDate: form.responsible.birthDate,
      relationShip: form.responsible.relationShip,
      occupation: form.responsible.occupation,
      phone: form.responsible.phone,
      address: form.responsible.address,
      email: null,
    });

    const fichaId = await insertFicha(
      applicantAlumnoId,
      carreraId,
      "registrado",
    );
    const examIsoDate = await scheduleAdmissionExam(fichaId);

    const {
      apellidoPaterno: notificationApellidoPaterno,
      apellidoMaterno: notificationApellidoMaterno,
    } = splitLastNames(form.identification.lastName);

    await sendAdmissionEmail({
      email: form.identification.email,
      nombre: form.identification.firstName,
      apellidoPaterno: notificationApellidoPaterno ?? undefined,
      apellidoMaterno: notificationApellidoMaterno ?? undefined,
      curp: form.identification.curp,
      fechaExamenIso: examIsoDate,
    });

    return {
      applicantPersonaId,
      applicantAlumnoId,
      campusId,
      carreraId,
      fichaId,
      examIsoDate,
    };
  } catch (error) {
    throw error;
  }
};

export const saveInscription = async (form: IFormInscription) => {
  try {
    const normalizedCurp = normalizeCurp(form.personalInfo.curp);
    const existingAlumno = await findAlumnoByCurp(normalizedCurp);

    if (existingAlumno) {
      const { data: existingInscription, error: existingInscriptionError } =
        await supabase
          .from("inscripciones")
          .select("id")
          .eq("curp", normalizedCurp)
          .maybeSingle();

      if (existingInscriptionError) {
        throw new Error(
          `Error al verificar inscripciones existentes: ${existingInscriptionError.message}`,
        );
      }

      if (existingInscription) {
        throw new Error("Esta CURP ya cuenta con una inscripción registrada.");
      }
    }

    const alumnoRecord = await findAlumnoByCurp(normalizedCurp);

    if (!alumnoRecord) {
      throw new Error(
        `No se encontró un aspirante registrado con la CURP ${normalizedCurp}.`,
      );
    }

    const { alumnoId, personaId } = alumnoRecord;

    const registrarResponsable = !!form.responsible?.hasDifferentResponsible;
    let responsableId: UUID | null = null;

    if (registrarResponsable) {
      const resp = form.responsible;
      if (
        !resp?.name ||
        !resp.lastName ||
        !resp.birthDate ||
        !resp.relationShip ||
        !resp.occupation ||
        !resp.phone
      ) {
        throw new Error(
          "Completa toda la información del responsable antes de enviar.",
        );
      }

      const responsable = await insertResponsable(alumnoId, {
        name: resp.name,
        lastName: resp.lastName,
        birthDate: resp.birthDate,
        relationShip: resp.relationShip,
        occupation: resp.occupation,
        phone: resp.phone,
        address: resp.address ?? null,
        email: resp.email ?? null,
      });
      responsableId = responsable.responsableId;
    }

    const folioActa = form.personalInfo.birthCertificate.trim().toUpperCase();

    const inscriptionId = await insertInscriptionRecord(
      alumnoId,
      normalizedCurp,
      folioActa,
      registrarResponsable,
      responsableId,
    );

    await Promise.all(
      form.schoolInfo.map(async (info, index) => {
        const cleanedName = info.name.trim();
        const cleanedPlace = info.placeExpedition.trim();
        const cleanedType = info.typeInstitution;
        const cleanedFolio = info.certificate.trim().toUpperCase();

        const schoolId = await getEscuelaId(cleanedName, cleanedType, null);
        const suffix = index + 1;
        const averageValue = parseAverage(info.averageFinal);
        if (averageValue === null) {
          throw new Error(
            `El promedio del registro ${suffix} no tiene el formato correcto (ej. 9.0).`,
          );
        }

        await insertEscolaridad(alumnoId, schoolId, averageValue, null);

        let urlCertificado: string | null = null;
        if (
          typeof info.certificateFile === "string" &&
          info.certificateFile.length > 0
        ) {
          urlCertificado = info.certificateFile.trim();
          await insertDocumento(
            alumnoId,
            `Certificado ${INSCRIPTION_LEVELS[index] ?? `Registro ${suffix}`}`,
            urlCertificado,
          );
        } else if (info.certificateFile instanceof File) {
          throw new Error(
            `El certificado del registro ${suffix} no se subió correctamente.`,
          );
        }

        const level = INSCRIPTION_LEVELS[index] ?? `Registro ${suffix}`;
        await insertInscripcionEscolaridad(inscriptionId, level, {
          nombre: cleanedName,
          lugarExpedicion: cleanedPlace,
          promedio: averageValue,
          folio: cleanedFolio,
          urlCertificado,
          tipoInstitucion: cleanedType,
        });
      }),
    );

    return { personaId, alumnoId, inscriptionId };
  } catch (error) {
    throw error;
  }
};
