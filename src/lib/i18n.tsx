import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'es' | 'en' | 'pt';

export interface PartnerTranslation {
  id: string;
  name: string;
  role: string;
  desc: string;
}

export interface RaptorCapabilityItem {
  num: string;
  title: string;
  desc: string;
}

export interface CrisisScenarioItem {
  id: 'hack' | 'extortion' | 'reputation';
  label: string;
  immediateLabel: string;
  immediateAction: string;
  avoidLabel: string;
  avoidAction: string;
  prefillText: string;
}

export interface TranslationDictionary {
  metaTitle: string;
  raptorMetaTitle: string;
  crisisMetaTitle: string;
  nav: {
    overview: string;
    services: string;
    backing: string;
    crisis: string;
    evaluation: string;
    cta: string;
    ariaMain: string;
    langSelectorAria: string;
  };
  hero: {
    kicker: [string, string, string];
    headline: string;
    body: string;
    primaryCta: string;
    emergencyTrigger: string;
    padlockAria: string;
  };
  services: {
    headline: string;
    subtitle: string;
    shieldAria: string;
    argos: {
      tierTag: string;
      subtitleTag: string;
      name: string;
      audience: string;
      items: { title: string; desc: string }[];
      cta: string;
    };
    atlas: {
      tierTag: string;
      subtitleTag: string;
      name: string;
      audience: string;
      items: { title: string; desc: string }[];
      cta: string;
    };
    raptorCallout: {
      kicker: [string, string];
      hook: string;
      cta: string;
    };
    crisisCallout: {
      kicker: [string, string];
      hook: string;
      cta: string;
    };
  };
  raptor: {
    nav: {
      backToMain: string;
      overview: string;
      capabilities: string;
      dossier: string;
      evaluation: string;
      cta: string;
    };
    hero: {
      kicker: [string, string];
      name: string;
      subtitle: string;
      body: string;
      primaryCta: string;
      eyeAria: string;
    };
    capabilities: {
      headline: string;
      subtitle: string;
      items: RaptorCapabilityItem[];
    };
    dossier: {
      kicker: [string, string];
      title: string;
      body: string;
      cta: string;
    };
  };
  tech: {
    headline: string;
    body: string;
    partners: PartnerTranslation[];
  };
  form: {
    headline: string;
    body: string;
    raptorHeadline: string;
    raptorBody: string;
    crisisHeadline: string;
    crisisBody: string;
    fields: {
      nameLabel: string;
      namePlaceholder: string;
      roleLabel: string;
      rolePlaceholder: string;
      refLabel: string;
      refPlaceholder: string;
      modeLabel: string;
      modeAria: string;
      soloOption: string;
      teamOption: string;
      concernLabel: string;
      optionalTag: string;
      concernPlaceholder: string;
      submitIdle: string;
      raptorSubmitIdle: string;
      crisisSubmitIdle: string;
      submitLoading: string;
    };
    validation: {
      errorPrefix: string;
      nameLength: (min: number, max: number) => string;
      roleLength: (min: number, max: number) => string;
      refEmpty: string;
      refInvalid: string;
      concernMax: (max: number) => string;
      idGenFailed: string;
      quotaExceeded: string;
      genericSubmitError: string;
    };
    confirmation: {
      title: string;
      folioLabel: string;
      tierLabel: string;
      nameLabel: string;
      roleLabel: string;
      refLabel: string;
      modeLabel: string;
      modeSoloDesc: string;
      modeTeamDesc: string;
      downloadBtn: string;
      emailBtn: string;
      gmailBtn: string;
      resetBtn: string;
      tierDisplayArgos: string;
      tierDisplayAtlas: string;
      tierDisplayRaptor: string;
      receiptHeader: string;
      receiptFolio: string;
      receiptDate: string;
      receiptName: string;
      receiptRole: string;
      receiptRef: string;
      receiptMode: string;
      receiptModeSolo: string;
      receiptModeTeam: string;
      receiptTier: string;
      receiptNotes: string;
      receiptNoNotes: string;
      mailSubjectPrefix: string;
      openSignalBtn: string;
    };
    signalCard: {
      emergencyToggle: string;
      emergencyNotice: string;
      emergencySignalLabel: string;
      emergencySignalSubtitle: string;
      unlockedKicker: (folio: string) => [string, string];
      unlockedTitle: string;
      unlockedBody: (folio: string) => string;
      userLabel: string;
      signalSubtitle: string;
      openSignalBtn: string;
      emailLabel: string;
      openMailAppBtn: string;
      openGmailBtn: string;
      openOutlookBtn: string;
      copyEmailBtn: string;
      copiedEmailBtn: string;
      privacyTrigger: string;
    };
  };
  footer: {
    crisisLink: string;
    contactTrigger: string;
    privacyLink: string;
    privateAccess: string;
  };
  privacy: {
    dialogAria: string;
    kicker: [string, string];
    title: string;
    intro: string;
    clauses: {
      num: string;
      title: string;
      desc: string;
    }[];
    directLabel: string;
    openSignalBtn: string;
    closeBtn: string;
    closeAria: string;
  };
  emergencyModal: {
    dialogAria: string;
    kicker: [string, string];
    title: string;
    body: string;
    signalLabel: string;
    signalSubtitle: string;
    openSignalBtn: string;
    crisisGuideCta: string;
    preventivePrompt: string;
    preventiveCta: string;
    privacyLink: string;
    closeAria: string;
  };
  crisisPage: {
    nav: {
      backToMain: string;
      overview: string;
      first30: string;
      reputation: string;
      hygiene: string;
      evaluation: string;
      cta: string;
    };
    hero: {
      kicker: [string, string];
      headline: string;
      body: string;
      primaryCta: string;
      signalCta: string;
    };
    triage: {
      kicker: [string, string];
      title: string;
      tabAria: string;
      scenarios: CrisisScenarioItem[];
      reportCaseCta: string;
      urgentSignalCta: string;
    };
    first30: {
      headline: string;
      subtitle: string;
      items: RaptorCapabilityItem[];
    };
    reputation: {
      kicker: [string, string];
      headline: string;
      body: string;
      items: RaptorCapabilityItem[];
      primaryCta: string;
      raptorCta: string;
    };
    hygiene: {
      headline: string;
      subtitle: string;
      items: RaptorCapabilityItem[];
      auditCta: string;
    };
  };
  admin: {
    dialogAria: string;
    headerTitle: string;
    exportCsv: string;
    signOut: string;
    closeAria: string;
    verifying: string;
    signInTitle: string;
    signInDesc: string;
    signInBtn: string;
    signInFailed: string;
    unauthorizedTitle: string;
    unauthorizedPrefix: string;
    unauthorizedMiddle: string;
    switchAccountBtn: string;
    tabs: {
      all: (count: number) => string;
      pendiente: (count: number) => string;
      en_revision: (count: number) => string;
      contactado: (count: number) => string;
      cerrado: (count: number) => string;
    };
    statusLabels: {
      pendiente: string;
      en_revision: string;
      contactado: string;
      cerrado: string;
    };
    searchPlaceholder: string;
    clearSearchAria: string;
    serviceFilterAria: string;
    serviceAll: string;
    sortNewest: string;
    sortOldest: string;
    queueCount: (shown: number, total: number) => string;
    selectPrompt: string;
    openDossier: string;
    backToList: (count: number) => string;
    dossierPosition: (index: number, total: number) => string;
    prevRequest: string;
    nextRequest: string;
    emptyFiltered: string;
    clearFiltersBtn: string;
    serviceLabel: string;
    modeLabel: string;
    dateLabel: string;
    copyBtn: string;
    copiedBtn: string;
    openLinkBtn: string;
    deleteBtn: string;
    unsavedNotes: string;
    hasNotesTag: string;
    loadingDocs: string;
    emptyDocs: string;
    recentFallback: string;
    confirmDelete: string;
    cancelDelete: string;
    deleteAria: string;
    modeAndTier: string;
    soloShort: string;
    teamShort: string;
    refLink: string;
    reportedConcern: string;
    noComments: string;
    dossierStatus: string;
    closedLockedMsg: string;
    reopenBtn: string;
    internalNotesLabel: string;
    internalNotesPlaceholder: string;
    savingBtn: string;
    saveNotesBtn: string;
    feedbackSyncError: string;
    feedbackStatusUpdated: (label: string) => string;
    feedbackStatusError: string;
    feedbackNotesSaved: string;
    feedbackNotesError: string;
    feedbackDeleteError: string;
  };
}

const DICTIONARIES: Record<Language, TranslationDictionary> = {
  es: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    raptorMetaTitle: 'Palantir Raptor — Inteligencia y Reconocimiento OSINT | Coto Privado',
    crisisMetaTitle: 'Guía ante Hackeo y Crisis de Reputación | Coto Privado',
    nav: {
      overview: 'Inicio',
      services: 'Servicios',
      backing: 'Respaldo',
      crisis: 'Crisis',
      evaluation: 'Evaluación',
      cta: 'Solicitar Auditoría',
      ariaMain: 'Navegación principal',
      langSelectorAria: 'Seleccionar idioma',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Seguridad de grado corporativo simplificada para ti.',
      body: 'Protegemos el patrimonio digital, la identidad y las operaciones de fundadores, creadores y figuras públicas, para que te concentres en lo que mejor sabes hacer.',
      primaryCta: 'Solicitar Auditoría Privada',
      emergencyTrigger: '¿Incidente activo?',
      padlockAria: 'Candado de seguridad',
    },
    services: {
      headline: 'Nuestros Servicios',
      subtitle: 'Dos niveles de protección según la estructura de tu operación.',
      shieldAria: 'Escudo de seguridad',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Cimiento Esencial',
        name: 'Argos',
        audience: 'Para profesionales independientes, fundadores y creadores de contenido.',
        items: [
          {
            title: 'Identidad Blindada',
            desc: 'Bóveda centralizada de contraseñas y correos alias para ocultar tu rastro.',
          },
          {
            title: 'Defensa Silenciosa',
            desc: 'Protección y parcheo automático de tus dispositivos (PC/Mac/Móvil) en segundo plano, sin interrumpir tu trabajo.',
          },
          {
            title: 'Diagnóstico de Exposición',
            desc: 'Auditoría inicial para detectar si tus datos ya están comprometidos en la web.',
          },
        ],
        cta: 'Elegir Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Blindaje Integral',
        name: 'Atlas',
        audience:
          'Para operaciones de alto perfil que requieren delegar accesos a equipos, agencias o colaboradores.',
        items: [
          {
            title: 'Delegación Zero-Knowledge',
            desc: 'Tu equipo inicia sesión en tus plataformas críticas sin ver jamás las contraseñas ni los códigos de seguridad (2FA).',
          },
          {
            title: 'Vigilancia Continua',
            desc: 'Monitoreo activo contra robo de sesiones, suplantación de identidad y rastreo de credenciales en la Dark Web.',
          },
          {
            title: 'Respuesta a Crisis (<30 min)',
            desc: 'Aislamiento remoto de dispositivos hackeados, canal de comunicación encriptado y dossier inmutable para el rescate rápido de cuentas.',
          },
        ],
        cta: 'Elegir Atlas',
      },
      raptorCallout: {
        kicker: ['División Especial', 'Inteligencia OSINT'],
        hook: '¿Necesitas saber qué revela la huella pública antes de dar un paso crítico? Conoce nuestra unidad de reconocimiento externo y pasivo.',
        cta: 'Explorar Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Protocolo Abierto', 'Respuesta y Contención'],
        hook: '¿Sufriste un acceso no autorizado, extorsión o una campaña de suplantación? Revisa las acciones críticas de los primeros 30 minutos.',
        cta: 'Abrir Guía de Crisis',
      },
    },
    raptor: {
      nav: {
        backToMain: 'Volver',
        overview: 'Resumen',
        capabilities: 'Capacidades',
        dossier: 'Dossier',
        evaluation: 'Evaluación',
        cta: 'Solicitar Inteligencia',
      },
      hero: {
        kicker: ['División Especial', 'Ejecución 100% Externa y Pasiva'],
        name: 'Palantir Raptor',
        subtitle: 'Inteligencia y Reconocimiento OSINT',
        body: 'Inteligencia táctica accionable basada en la recolección y análisis de fuentes abiertas (OSINT) para individuos y corporaciones. Ejecución 100% externa y pasiva.',
        primaryCta: 'Solicitar Dossier OSINT',
        eyeAria: 'Esfera Palantír y faro óptico de observación en cristal tornasol',
      },
      capabilities: {
        headline: 'Vectores de Reconocimiento',
        subtitle:
          'Recolección y correlación pasiva sobre fuentes públicas, registros técnicos y exposición filtrada.',
        items: [
          {
            num: '01',
            title: 'Reconocimiento e Identificación',
            desc: 'Perfilamiento de personas de interés, investigación de terceros (due diligence) y trazabilidad completa de la huella digital.',
          },
          {
            num: '02',
            title: 'Inteligencia Competitiva',
            desc: 'Análisis del entorno corporativo, monitoreo de la reputación de marca y mapeo de la infraestructura pública de competidores.',
          },
          {
            num: '03',
            title: 'Análisis de Riesgo y Exposición',
            desc: 'Rastreo profundo de credenciales, documentos confidenciales y datos personales filtrados en la Surface y Dark Web.',
          },
          {
            num: '04',
            title: 'Superficie de Ataque',
            desc: 'Detección de dominios clonados, campañas de suplantación de identidad y activos digitales expuestos que representan una amenaza.',
          },
        ],
      },
      dossier: {
        kicker: ['Entregable Confidencial', 'Cero Interacción con el Objetivo'],
        title: 'Dossier Táctico',
        body: 'Un reporte de inteligencia confidencial con evidencia directa y rutas de mitigación, estructurado a partir del análisis de información pública, sin alertar ni interactuar con la infraestructura del objetivo.',
        cta: 'Coordinar Operación OSINT',
      },
    },
    tech: {
      headline: 'Tecnología y Respaldo',
      body: 'Operamos bajo una arquitectura de confianza cero impulsada por líderes de la industria: Keeper, Cloudflare, ESET, Action1 e iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Bóveda criptográfica',
          desc: 'Cifrado a nivel de dispositivo para credenciales, llaves de acceso y secretos críticos.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perímetro y DNS privado',
          desc: 'Filtrado de red, túneles encriptados y bloqueo preventivo de dominios de phishing.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Protección de endpoints',
          desc: 'Defensa antimalware ligera en macOS y Windows contra infostealers y troyanos.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Gestión de vulnerabilidades',
          desc: 'Cierre autónomo de brechas en sistemas operativos, navegadores y aplicaciones.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridad móvil',
          desc: 'Detección avanzada de spyware y endurecimiento de seguridad en iOS y Android.',
        },
      ],
    },
    form: {
      headline: 'Formulario de Evaluación',
      body: 'Completa estos datos esenciales —puedes usar un alias— para coordinar tu diagnóstico inicial. Nunca solicitamos contraseñas ni acceso a dispositivos en esta etapa.',
      raptorHeadline: 'Solicitud de Inteligencia — Palantir Raptor',
      raptorBody:
        'Completa estos datos esenciales —puedes usar un alias— para coordinar el alcance de reconocimiento pasivo. Ejecución confidencial sin alertar ni tocar infraestructura.',
      crisisHeadline: 'Registro de Incidente o Contención',
      crisisBody:
        'Registra tu caso —puedes emplear un alias— para coordinar contención, recuperación de accesos o blindaje posterior al incidente. Nunca pedimos contraseñas en este formulario.',
      fields: {
        nameLabel: 'Nombre / Alias',
        namePlaceholder: 'Ej. Martín V. o alias privado',
        roleLabel: 'Rol principal (Ej. Fundador, Creador, Consultor)',
        rolePlaceholder: 'Fundador, Dirección, Figura pública...',
        refLabel: 'Enlace de referencia (Web de tu proyecto / Red social principal)',
        refPlaceholder: 'https://tuproyecto.com o @perfil',
        modeLabel: '¿Operas en solitario o delegas accesos a un equipo/agencia?',
        modeAria: 'Modalidad operativa',
        soloOption: 'Solo',
        teamOption: 'Equipo',
        concernLabel: '¿Tienes alguna preocupación de seguridad o incidente reciente?',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve si deseas compartirlo...',
        submitIdle: 'Solicitar Auditoría Privada',
        raptorSubmitIdle: 'Solicitar Operación Palantir Raptor',
        crisisSubmitIdle: 'Registrar Caso Prioritario',
        submitLoading: 'Enviando solicitud...',
      },
      validation: {
        errorPrefix: 'Error',
        nameLength: (min, max) => `Ingresa tu nombre o alias (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Especifica tu rol principal (${min} a ${max} caracteres).`,
        refEmpty: 'Comparte el enlace de tu proyecto o perfil principal.',
        refInvalid: 'Introduce un dominio válido (ej. tuproyecto.com) o usuario (ej. @usuario).',
        concernMax: (max) => `Máximo ${max} caracteres.`,
        idGenFailed: 'No fue posible generar un identificador seguro. Intenta nuevamente.',
        quotaExceeded:
          'Se alcanzó el límite diario de base de datos. Intenta mañana o contacta por correo.',
        genericSubmitError:
          'Ocurrió un inconveniente al registrar tu solicitud. Verifica tu conexión e inténtalo de nuevo.',
      },
      confirmation: {
        title: 'Solicitud Privada Registrada',
        folioLabel: 'Folio',
        tierLabel: 'Servicio asignado',
        nameLabel: 'Nombre / Alias',
        roleLabel: 'Rol principal',
        refLabel: 'Enlace de referencia',
        modeLabel: 'Modalidad',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Equipo',
        downloadBtn: 'Descargar comprobante',
        emailBtn: 'App de correo',
        gmailBtn: 'Gmail Web',
        resetBtn: 'Nueva solicitud',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        tierDisplayRaptor: 'Palantir Raptor',
        receiptHeader: 'COTO PRIVADO — SOLICITUD CONFIDENCIAL',
        receiptFolio: 'Folio',
        receiptDate: 'Fecha',
        receiptName: 'Nombre / Alias',
        receiptRole: 'Rol principal',
        receiptRef: 'Referencia',
        receiptMode: 'Modalidad',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Equipo',
        receiptTier: 'Servicio',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Sin incidentes reportados',
        mailSubjectPrefix: 'Solicitud Confidencial',
        openSignalBtn: 'Abrir Signal',
      },
      signalCard: {
        emergencyToggle: '¿Incidente de seguridad activo?',
        emergencyNotice:
          'Vía exclusiva para brechas en curso, secuestro de cuentas o extorsión activa. Para diagnósticos preventivos o dudas generales, completa la evaluación.',
        emergencySignalLabel: 'Línea de emergencia',
        emergencySignalSubtitle: 'Canal cifrado en Signal',
        unlockedKicker: (folio) => ['Canales habilitados', `Folio ${folio}`],
        unlockedTitle: 'Contacto directo habilitado',
        unlockedBody: (folio) =>
          `Tu expediente está registrado. Puedes escribirnos directamente por Signal o correo con tu referencia ${folio} prellenada.`,
        userLabel: 'Canal cifrado Signal',
        signalSubtitle: 'Mensajería directa de extremo a extremo',
        openSignalBtn: 'Abrir Signal',
        emailLabel: 'Correo institucional',
        openMailAppBtn: 'App de correo',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copiar correo',
        copiedEmailBtn: 'Correo copiado',
        privacyTrigger: 'Compromiso de privacidad y confidencialidad',
      },
    },
    footer: {
      crisisLink: 'Guía de Crisis',
      contactTrigger: 'Contacto y Emergencias',
      privacyLink: 'Privacidad y Confidencialidad',
      privateAccess: 'Acceso Privado',
    },
    privacy: {
      dialogAria: 'Compromiso de privacidad y confidencialidad de Coto Privado',
      kicker: ['Coto Privado', 'Protocolo de Reserva'],
      title: 'Privacidad y Confidencialidad',
      intro:
        'Cada acercamiento, consulta o reporte de incidente se gestiona bajo estricta discreción operativa y minimización absoluta de información.',
      clauses: [
        {
          num: '01',
          title: 'Reserva profesional y acuerdo NDA',
          desc: 'Toda comunicación, identidad, alias o contexto operativo compartido está protegido bajo secreto profesional desde el primer contacto. Firmamos acuerdos de no divulgación (NDA) previos a cualquier alcance técnico cuando la operación lo requiera.',
        },
        {
          num: '02',
          title: 'Minimización de datos y cero terceros',
          desc: 'Recopilamos únicamente los datos mínimos necesarios para coordinar tu evaluación, admitiendo el uso de alias. Jamás comercializamos, cedemos ni exponemos información a terceros, anunciantes ni rastreadores externos.',
        },
        {
          num: '03',
          title: 'Comunicaciones cifradas y atención de emergencias',
          desc: 'Nunca solicitamos contraseñas, códigos 2FA ni acceso a dispositivos mediante este sitio web. Para consultas sensibles o incidentes activos, operamos mediante nuestro canal oficial cifrado de extremo a extremo en Signal.',
        },
        {
          num: '04',
          title: 'Retención controlada y supresión inmediata',
          desc: 'Los expedientes de evaluación se conservan únicamente durante la coordinación del servicio. Puedes solicitar la eliminación definitiva e inmediata de cualquier registro a través de nuestro canal en Signal o escribiendo a help@coto.lat.',
        },
      ],
      directLabel: 'Canal cifrado directo',
      openSignalBtn: 'Abrir canal en Signal',
      closeBtn: 'Entendido',
      closeAria: 'Cerrar aviso de privacidad y confidencialidad',
    },
    emergencyModal: {
      dialogAria: 'Protocolo de atención a incidentes de seguridad activos',
      kicker: ['Coto Privado', 'Atención de Crisis'],
      title: '¿Incidente de seguridad activo?',
      body: 'Vía exclusiva para brechas en curso, secuestro de cuentas o extorsión activa. Comunicación directa cifrada de extremo a extremo sin intermediarios.',
      signalLabel: 'Línea de emergencia',
      signalSubtitle: 'Canal oficial cifrado en Signal',
      openSignalBtn: 'Abrir Signal',
      crisisGuideCta: 'Ver guía paso a paso ante hackeo o crisis',
      preventivePrompt: '¿Buscas una auditoría preventiva o tienes dudas generales?',
      preventiveCta: 'Ir al formulario de evaluación',
      privacyLink: 'Privacidad y confidencialidad',
      closeAria: 'Cerrar protocolo de emergencia',
    },
    crisisPage: {
      nav: {
        backToMain: 'Volver',
        overview: 'Diagnóstico',
        first30: 'Primeros 30 Min',
        reputation: 'Reputación',
        hygiene: 'Blindaje',
        evaluation: 'Contacto',
        cta: 'Solicitar Contención',
      },
      hero: {
        kicker: ['Protocolo de Contención', 'Seguridad y Reputación'],
        headline: 'Qué hacer ante un hackeo o una crisis de reputación.',
        body: 'Las decisiones tomadas durante los primeros 30 minutos definen si un incidente se contiene en privado o escala públicamente. Sigue esta guía práctica antes de modificar dispositivos comprometidos o responder bajo presión.',
        primaryCta: 'Registrar Caso en Formulario',
        signalCta: 'Emergencia en curso (Signal)',
      },
      triage: {
        kicker: ['Diagnóstico Rápido', 'Selecciona tu situación actual'],
        title: 'Guía inmediata según el tipo de incidente',
        tabAria: 'Escenarios de crisis',
        scenarios: [
          {
            id: 'hack',
            label: 'Secuestro de cuentas',
            immediateLabel: 'Primer paso crítico',
            immediateAction:
              'Desde otro dispositivo limpio, cambia la contraseña de tu correo principal, revoca todas las sesiones activas y verifica que no existan reglas de reenvío ocultas ni dispositivos desconocidos vinculados.',
            avoidLabel: 'Lo que debes evitar',
            avoidAction:
              'No intentes recuperar contraseñas desde la misma computadora o teléfono donde ocurrió el incidente; si hay un infostealer activo, volverás a entregar la nueva clave al atacante.',
            prefillText:
              '[Secuestro de cuentas / Acceso no autorizado] Plataforma afectada y momento aproximado del incidente: ',
          },
          {
            id: 'extortion',
            label: 'Extorsión o filtración',
            immediateLabel: 'Primer paso crítico',
            immediateAction:
              'Conserva capturas íntegras de los mensajes, cabeceras de correo, billeteras o perfiles remitentes, y corta de inmediato cualquier acceso adicional cerrando sesiones en la nube y bóvedas.',
            avoidLabel: 'Lo que debes evitar',
            avoidAction:
              'No cedas a pagos rápidos ni borres el historial de conversación con el atacante. Pagar no garantiza la eliminación del material y suele incentivar nuevas exigencias.',
            prefillText:
              '[Extorsión / Filtración de información] Canal por el que recibiste la amenaza y tipo de activo comprometido: ',
          },
          {
            id: 'reputation',
            label: 'Crisis de reputación',
            immediateLabel: 'Primer paso crítico',
            immediateAction:
              'Asegura las cuentas oficiales tuyas y de tu equipo directivo, documenta URLs exactas, cuentas espejo o dominios falsos con marca de tiempo, y centraliza cualquier comunicación en un solo canal verificado.',
            avoidLabel: 'Lo que debes evitar',
            avoidAction:
              'No confrontes públicamente a cuentas anónimas ni difundas enlaces maliciosos tratando de desmentirlos: eso amplifica su alcance algorítmico y alerta al adversario antes de documentar pruebas.',
            prefillText:
              '[Crisis de reputación / Suplantación] Enlaces, cuentas o dominios involucrados y contexto breve: ',
          },
        ],
        reportCaseCta: 'Llevar este escenario al formulario',
        urgentSignalCta: 'Abrir Signal cifrado',
      },
      first30: {
        headline: 'Protocolo de los Primeros 30 Minutos',
        subtitle:
          'Cuatro medidas esenciales de contención técnica antes de iniciar la recuperación profunda.',
        items: [
          {
            num: '01',
            title: 'Aísla la red sin formatear el equipo',
            desc: 'Desactiva el Wi-Fi y los datos móviles del dispositivo sospechoso para cortar el control remoto activo, pero evita restaurarlo de fábrica de inmediato si necesitas conservar rastros técnicos de qué información fue accedida.',
          },
          {
            num: '02',
            title: 'Protege primero tu correo raíz e identidad',
            desc: 'El correo principal es la llave maestra para restablecer redes sociales, banca y dominios. Entra desde un equipo seguro, cierra sesiones abiertas, revisa filtros de reenvío automático y renueva el segundo factor (2FA).',
          },
          {
            num: '03',
            title: 'Bloquea tu línea móvil (SIM Swap) y finanzas',
            desc: 'Si perdiste señal celular sin razón aparente, contacta de inmediato a tu operador desde otro teléfono para bloquear cambios de chip o eSIM no autorizados y solicita congelamiento preventivo en banca o exchanges.',
          },
          {
            num: '04',
            title: 'Revoca accesos delegados y tokens OAuth',
            desc: 'En operaciones con agencias, editores o asistentes, el vector de entrada suele ser el equipo de un colaborador. Suspende temporalmente sesiones compartidas, integraciones de terceros y llaves API.',
          },
        ],
      },
      reputation: {
        kicker: ['Contención Reputacional', 'Suplantación, Difamación y Exposición'],
        headline: 'Cuando el ataque apunta a tu nombre, marca o credibilidad',
        body: 'Una crisis digital rara vez es solo técnica: dominios clonados, perfiles falsos verificados, filtraciones fuera de contexto o campañas coordinadas requieren asegurar tu perímetro y recolectar inteligencia pasiva sin alertar a la contraparte.',
        items: [
          {
            num: '01',
            title: 'Blindaje inmediato de vocería y perfiles clave',
            desc: 'Endurecimiento urgente de las cuentas personales de fundadores, socios y familiares directos para impedir secuestros secundarios en medio de la crisis.',
          },
          {
            num: '02',
            title: 'Trazabilidad pasiva de origen (OSINT)',
            desc: 'Mapeo externo de dominios espejo, infraestructura vinculada y cuentas coordinadas para dimensionar el alcance real antes de emitir declaraciones o acciones legales.',
          },
          {
            num: '03',
            title: 'Dossier técnico para reportes y desindexación',
            desc: 'Estructuración de evidencia verificable (registros DNS, capturas íntegras e historial público) lista para respaldar solicitudes de baja por suplantación o asesoría jurídica.',
          },
        ],
        primaryCta: 'Coordinar Contención Confidencial',
        raptorCta: 'Conocer unidad OSINT Palantir Raptor',
      },
      hygiene: {
        headline: 'Cuatro Hábitos que Evitan el 90% de las Crisis',
        subtitle:
          'Si hoy no enfrentas un incidente activo, aplicar estas medidas reduce drásticamente tu superficie de exposición.',
        items: [
          {
            num: '01',
            title: 'Aísla tu correo financiero y de recuperación',
            desc: 'Nunca uses el mismo correo que aparece en tu web, prensa o redes sociales para iniciar sesión en bancos, dominios o bóvedas principales. Emplea direcciones alias exclusivas.',
          },
          {
            num: '02',
            title: 'Reemplaza códigos por SMS con llaves o apps 2FA',
            desc: 'El código por mensaje de texto es vulnerable al secuestro de línea (SIM Swapping). Usa llaves físicas de seguridad o autenticadores cifrados independientes del número telefónico.',
          },
          {
            num: '03',
            title: 'Delega accesos sin revelar jamás la contraseña',
            desc: 'Compartir claves por WhatsApp o correo con tu equipo multiplica el riesgo. Utiliza bóvedas Zero-Knowledge donde colaboradores operan sin ver credenciales ni códigos 2FA.',
          },
          {
            num: '04',
            title: 'Mantén parches al día y verifica enlaces urgentes',
            desc: 'La mayoría de robos de sesión entran por navegadores desactualizados o falsos avisos de soporte, copyright o inversión. Desconfía de cualquier urgencia que pida iniciar sesión.',
          },
        ],
        auditCta: 'Solicitar auditoría preventiva',
      },
    },
    admin: {
      dialogAria: 'Panel privado de evaluaciones Coto Privado',
      headerTitle: 'Solicitudes — Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Salir',
      closeAria: 'Cerrar panel',
      verifying: 'Verificando credenciales...',
      signInTitle: 'Acceso Administrativo',
      signInDesc: 'Inicia sesión con tu cuenta corporativa @coto.lat para gestionar las solicitudes.',
      signInBtn: 'Autenticar con Google',
      signInFailed: 'No se pudo completar el inicio de sesión con Google.',
      unauthorizedTitle: 'Cuenta sin permisos',
      unauthorizedPrefix: 'La sesión actual',
      unauthorizedMiddle: 'no tiene acceso. Inicia sesión con una cuenta corporativa',
      switchAccountBtn: 'Cambiar de cuenta Google',
      tabs: {
        all: (count) => `Todas (${count})`,
        pendiente: (count) => `Pendientes (${count})`,
        en_revision: (count) => `En revisión (${count})`,
        contactado: (count) => `Contactados (${count})`,
        cerrado: (count) => `Cerrados (${count})`,
      },
      statusLabels: {
        pendiente: 'Pendiente',
        en_revision: 'En revisión',
        contactado: 'Contactado',
        cerrado: 'Cerrado',
      },
      searchPlaceholder: 'Buscar por folio, nombre, rol, referencia o notas...',
      clearSearchAria: 'Limpiar búsqueda',
      serviceFilterAria: 'Filtrar por servicio',
      serviceAll: 'Todos los servicios',
      sortNewest: 'Más recientes',
      sortOldest: 'Más antiguas',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'solicitud' : 'solicitudes'}`
          : `${shown} de ${total} solicitudes`,
      selectPrompt: 'Selecciona una fila para gestionar',
      openDossier: 'Ver detalle',
      backToList: (count) => `Volver a la lista (${count})`,
      dossierPosition: (index, total) => `Solicitud ${index} de ${total}`,
      prevRequest: 'Anterior',
      nextRequest: 'Siguiente',
      emptyFiltered: 'Ninguna solicitud coincide con los filtros actuales.',
      clearFiltersBtn: 'Restablecer filtros',
      serviceLabel: 'Servicio asignado',
      modeLabel: 'Modalidad operativa',
      dateLabel: 'Fecha de registro',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      openLinkBtn: 'Abrir enlace',
      deleteBtn: 'Eliminar',
      unsavedNotes: 'Cambios sin guardar',
      hasNotesTag: 'Con notas internas registradas',
      loadingDocs: 'Cargando solicitudes...',
      emptyDocs: 'No hay solicitudes registradas todavía.',
      recentFallback: 'Reciente',
      confirmDelete: 'Confirmar borrado',
      cancelDelete: 'Cancelar',
      deleteAria: 'Eliminar solicitud',
      modeAndTier: 'Modalidad y Servicio',
      soloShort: 'Solo',
      teamShort: 'Equipo',
      refLink: 'Enlace o perfil de referencia',
      reportedConcern: 'Preocupación o incidente reportado',
      noComments: 'Sin comentarios adicionales.',
      dossierStatus: 'Estado del expediente',
      closedLockedMsg: 'Expediente cerrado (edición bloqueada).',
      reopenBtn: 'Reabrir expediente',
      internalNotesLabel: 'Notas internas de seguimiento',
      internalNotesPlaceholder: 'Registra acuerdos, contexto de contacto o siguientes pasos...',
      savingBtn: 'Guardando...',
      saveNotesBtn: 'Guardar notas',
      feedbackSyncError: 'No fue posible sincronizar las solicitudes.',
      feedbackStatusUpdated: (label) => `Estado actualizado a ${label}.`,
      feedbackStatusError: 'Error al actualizar el estado.',
      feedbackNotesSaved: 'Notas guardadas.',
      feedbackNotesError: 'No se pudieron guardar las notas.',
      feedbackDeleteError: 'No fue posible eliminar el registro.',
    },
  },

  en: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    raptorMetaTitle: 'Palantir Raptor — OSINT Intelligence & Reconnaissance | Coto Privado',
    crisisMetaTitle: 'Breach & Reputation Crisis Playbook | Coto Privado',
    nav: {
      overview: 'Overview',
      services: 'Services',
      backing: 'Technology',
      crisis: 'Crisis',
      evaluation: 'Assessment',
      cta: 'Request Audit',
      ariaMain: 'Primary navigation',
      langSelectorAria: 'Select language',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Corporate-grade security simplified for you.',
      body: 'We protect the digital wealth, identity, and operations of founders, creators, and public figures, so you can focus on what you do best.',
      primaryCta: 'Request Private Audit',
      emergencyTrigger: 'Active incident?',
      padlockAria: 'Security padlock',
    },
    services: {
      headline: 'Our Services',
      subtitle: 'Two protection tiers structured around your operation.',
      shieldAria: 'Security shield',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Essential Foundation',
        name: 'Argos',
        audience: 'For independent professionals, founders, and content creators.',
        items: [
          {
            title: 'Shielded Identity',
            desc: 'Centralized password vault and alias emails to conceal your digital footprint.',
          },
          {
            title: 'Silent Defense',
            desc: 'Automated protection and background patching across your devices (PC/Mac/Mobile) without interrupting your workflow.',
          },
          {
            title: 'Exposure Diagnostic',
            desc: 'Initial baseline audit to detect whether your personal data is already compromised online.',
          },
        ],
        cta: 'Select Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Comprehensive Shielding',
        name: 'Atlas',
        audience:
          'For high-profile operations that delegate access to teams, agencies, or collaborators.',
        items: [
          {
            title: 'Zero-Knowledge Delegation',
            desc: 'Your team logs into critical platforms without ever seeing your passwords or security codes (2FA).',
          },
          {
            title: 'Continuous Vigilance',
            desc: 'Active monitoring against session hijacking, impersonation, and Dark Web credential leaks.',
          },
          {
            title: 'Crisis Response (<30 min)',
            desc: 'Remote isolation of compromised devices, encrypted communication channel, and immutable recovery dossier.',
          },
        ],
        cta: 'Select Atlas',
      },
      raptorCallout: {
        kicker: ['Special Division', 'OSINT Intelligence'],
        hook: 'Need to know what the public footprint reveals before making a critical move? Explore our external, passive reconnaissance unit.',
        cta: 'Explore Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Open Protocol', 'Breach & Reputation Response'],
        hook: 'Facing an account takeover, extortion attempt, or impersonation crisis? Review our critical first-30-minute containment actions.',
        cta: 'Open Crisis Guide',
      },
    },
    raptor: {
      nav: {
        backToMain: 'Back',
        overview: 'Overview',
        capabilities: 'Capabilities',
        dossier: 'Dossier',
        evaluation: 'Assessment',
        cta: 'Request Intelligence',
      },
      hero: {
        kicker: ['Special Division', '100% External & Passive Execution'],
        name: 'Palantir Raptor',
        subtitle: 'OSINT Intelligence & Reconnaissance',
        body: 'Actionable tactical intelligence based on Open-Source Intelligence (OSINT) collection and analysis for individuals and corporations. 100% external and passive execution.',
        primaryCta: 'Request OSINT Dossier',
        eyeAria: 'Iridescent crystal Palantír orb and optical observation beacon',
      },
      capabilities: {
        headline: 'Reconnaissance Vectors',
        subtitle:
          'Passive collection and correlation across public records, technical infrastructure, and leaked exposure.',
        items: [
          {
            num: '01',
            title: 'Reconnaissance & Identification',
            desc: 'Profiling of persons of interest, third-party due diligence investigations, and full end-to-end digital footprint traceability.',
          },
          {
            num: '02',
            title: 'Competitive Intelligence',
            desc: 'Corporate environment analysis, brand reputation monitoring, and mapping of competitors’ public infrastructure.',
          },
          {
            num: '03',
            title: 'Risk & Exposure Analysis',
            desc: 'Deep tracking of credentials, confidential documents, and leaked personal data across the Surface and Dark Web.',
          },
          {
            num: '04',
            title: 'Attack Surface',
            desc: 'Detection of cloned domains, impersonation campaigns, and exposed digital assets that represent an active threat.',
          },
        ],
      },
      dossier: {
        kicker: ['Confidential Deliverable', 'Zero Target Interaction'],
        title: 'Tactical Dossier',
        body: 'A confidential intelligence report with direct evidence and mitigation pathways, structured strictly from public information analysis without alerting or interacting with the target’s infrastructure.',
        cta: 'Coordinate OSINT Operation',
      },
    },
    tech: {
      headline: 'Technology & Backing',
      body: 'We operate on a zero-trust architecture powered by industry leaders: Keeper, Cloudflare, ESET, Action1, and iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Cryptographic vault',
          desc: 'Device-level encryption for credentials, passkeys, and critical secrets.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perimeter & private DNS',
          desc: 'Network filtering, encrypted tunnels, and preemptive phishing domain blocking.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Endpoint protection',
          desc: 'Lightweight anti-malware defense on macOS and Windows against infostealers.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Vulnerability management',
          desc: 'Autonomous security updates across operating systems, browsers, and apps.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Mobile integrity',
          desc: 'Advanced spyware detection and system hardening for iOS and Android.',
        },
      ],
    },
    form: {
      headline: 'Assessment Form',
      body: 'Complete these essential details—you may use an alias—to coordinate your initial diagnostic. We never request passwords or device access at this stage.',
      raptorHeadline: 'Intelligence Request — Palantir Raptor',
      raptorBody:
        'Complete these essential details—you may use an alias—to coordinate your passive reconnaissance scope. Confidential execution without alerting or touching infrastructure.',
      crisisHeadline: 'Incident & Containment Intake',
      crisisBody:
        'Register your case—aliases are welcome—to coordinate containment, account recovery, or post-incident hardening. We never request passwords through this form.',
      fields: {
        nameLabel: 'Name / Alias',
        namePlaceholder: 'E.g. Martin V. or private alias',
        roleLabel: 'Primary role (E.g. Founder, Creator, Consultant)',
        rolePlaceholder: 'Founder, Executive, Public Figure...',
        refLabel: 'Reference link (Project website / Main social profile)',
        refPlaceholder: 'https://yourproject.com or @handle',
        modeLabel: 'Do you operate solo or delegate access to a team/agency?',
        modeAria: 'Operating mode',
        soloOption: 'Solo',
        teamOption: 'Team',
        concernLabel: 'Do you have any security concern or recent incident?',
        optionalTag: 'Optional',
        concernPlaceholder: 'Brief context if you wish to share...',
        submitIdle: 'Request Private Audit',
        raptorSubmitIdle: 'Request Palantir Raptor Operation',
        crisisSubmitIdle: 'Submit Priority Case',
        submitLoading: 'Submitting request...',
      },
      validation: {
        errorPrefix: 'Error',
        nameLength: (min, max) => `Enter your name or alias (${min} to ${max} characters).`,
        roleLength: (min, max) => `Specify your primary role (${min} to ${max} characters).`,
        refEmpty: 'Share your project website or primary social profile.',
        refInvalid: 'Enter a valid domain (e.g. yourproject.com) or handle (e.g. @handle).',
        concernMax: (max) => `Maximum ${max} characters.`,
        idGenFailed: 'Unable to generate a secure identifier. Please try again.',
        quotaExceeded: 'Daily database quota reached. Please try again tomorrow or contact via email.',
        genericSubmitError:
          'An issue occurred while saving your request. Check your connection and try again.',
      },
      confirmation: {
        title: 'Private Request Registered',
        folioLabel: 'Reference',
        tierLabel: 'Assigned service',
        nameLabel: 'Name / Alias',
        roleLabel: 'Primary role',
        refLabel: 'Reference link',
        modeLabel: 'Mode',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Team',
        downloadBtn: 'Download receipt',
        emailBtn: 'Mail app',
        gmailBtn: 'Gmail Web',
        resetBtn: 'New request',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        tierDisplayRaptor: 'Palantir Raptor',
        receiptHeader: 'COTO PRIVADO — CONFIDENTIAL REQUEST',
        receiptFolio: 'Reference',
        receiptDate: 'Date',
        receiptName: 'Name / Alias',
        receiptRole: 'Primary role',
        receiptRef: 'Link',
        receiptMode: 'Mode',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Team',
        receiptTier: 'Service',
        receiptNotes: 'Notes',
        receiptNoNotes: 'No recent incidents reported',
        mailSubjectPrefix: 'Confidential Request',
        openSignalBtn: 'Open Signal',
      },
      signalCard: {
        emergencyToggle: 'Active security incident?',
        emergencyNotice:
          'Strictly reserved for ongoing breaches, account takeovers, or active extortion. For preventive audits or general inquiries, complete the assessment form.',
        emergencySignalLabel: 'Emergency line',
        emergencySignalSubtitle: 'Encrypted Signal channel',
        unlockedKicker: (folio) => ['Channels enabled', `Ref ${folio}`],
        unlockedTitle: 'Direct contact enabled',
        unlockedBody: (folio) =>
          `Your dossier is registered. Reach us directly via Signal or email with your reference ${folio} prefilled.`,
        userLabel: 'Encrypted Signal channel',
        signalSubtitle: 'Direct end-to-end encrypted messaging',
        openSignalBtn: 'Open Signal',
        emailLabel: 'Institutional email',
        openMailAppBtn: 'Mail app',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copy email',
        copiedEmailBtn: 'Email copied',
        privacyTrigger: 'Privacy & confidentiality commitment',
      },
    },
    footer: {
      crisisLink: 'Crisis Guide',
      contactTrigger: 'Contact & Emergencies',
      privacyLink: 'Privacy & Confidentiality',
      privateAccess: 'Private Access',
    },
    privacy: {
      dialogAria: 'Coto Privado privacy and confidentiality commitment',
      kicker: ['Coto Privado', 'Discretion Protocol'],
      title: 'Privacy & Confidentiality',
      intro:
        'Every inquiry, assessment, or incident report is handled under strict operational discretion and data minimization.',
      clauses: [
        {
          num: '01',
          title: 'Professional secrecy & NDA availability',
          desc: 'All communications, identities, aliases, and operational context are treated as strictly confidential from first contact. Mutual non-disclosure agreements (NDAs) are available prior to any technical engagement.',
        },
        {
          num: '02',
          title: 'Data minimization & zero third-party sharing',
          desc: 'We collect only the minimum details required to coordinate your assessment and fully support aliases. Information is never sold, shared, or exposed to third parties, advertisers, or external trackers.',
        },
        {
          num: '03',
          title: 'End-to-end encrypted channel & emergencies',
          desc: 'We never ask for passwords, 2FA codes, or device access through this website. For sensitive inquiries or active security emergencies, contact us through our official end-to-end encrypted Signal channel.',
        },
        {
          num: '04',
          title: 'Controlled retention & immediate deletion',
          desc: 'Assessment records are retained solely to coordinate your case. You may request immediate, permanent deletion of any record at any time via our official Signal channel or help@coto.lat.',
        },
      ],
      directLabel: 'Direct encrypted channel',
      openSignalBtn: 'Open Signal channel',
      closeBtn: 'Close',
      closeAria: 'Close privacy and confidentiality notice',
    },
    emergencyModal: {
      dialogAria: 'Active security incident response protocol',
      kicker: ['Coto Privado', 'Crisis Response'],
      title: 'Active security incident?',
      body: 'Strictly reserved for ongoing breaches, account takeovers, or active extortion. Direct end-to-end encrypted communication with zero intermediaries.',
      signalLabel: 'Emergency line',
      signalSubtitle: 'Official encrypted Signal channel',
      openSignalBtn: 'Open Signal',
      crisisGuideCta: 'Read step-by-step breach & crisis guide',
      preventivePrompt: 'Looking for a preventive audit or general inquiry?',
      preventiveCta: 'Go to assessment form',
      privacyLink: 'Privacy & confidentiality',
      closeAria: 'Close emergency protocol',
    },
    crisisPage: {
      nav: {
        backToMain: 'Back',
        overview: 'Triage',
        first30: 'First 30 Min',
        reputation: 'Reputation',
        hygiene: 'Hardening',
        evaluation: 'Contact',
        cta: 'Request Containment',
      },
      hero: {
        kicker: ['Containment Protocol', 'Security & Reputation'],
        headline: 'What to do during a breach or reputation crisis.',
        body: 'Decisions made in the first 30 minutes determine whether an incident stays privately contained or escalates publicly. Follow this practical playbook before wiping devices or responding under pressure.',
        primaryCta: 'Register Case in Form',
        signalCta: 'Ongoing breach (Signal)',
      },
      triage: {
        kicker: ['Rapid Triage', 'Select your current situation'],
        title: 'Immediate guidance by incident type',
        tabAria: 'Crisis scenarios',
        scenarios: [
          {
            id: 'hack',
            label: 'Account takeover',
            immediateLabel: 'Critical first move',
            immediateAction:
              'From a separate, clean device, rotate your primary email password, revoke all active sessions, and check for hidden email forwarding rules or unknown linked devices.',
            avoidLabel: 'What to avoid',
            avoidAction:
              'Never reset passwords from the same computer or phone where the breach occurred—if an infostealer is present, you will hand the new credentials straight back to the attacker.',
            prefillText:
              '[Account Takeover / Unauthorized Access] Affected platform and approximate time of incident: ',
          },
          {
            id: 'extortion',
            label: 'Extortion or leak',
            immediateLabel: 'Critical first move',
            immediateAction:
              'Preserve full screenshots of messages, email headers, wallet addresses, or sender handles, and immediately cut further access by terminating cloud and vault sessions.',
            avoidLabel: 'What to avoid',
            avoidAction:
              'Do not rush into ransom payments or delete attacker chat threads. Paying rarely stops publication and typically invites repeated demands.',
            prefillText:
              '[Extortion / Data Leak] Channel where the threat arrived and type of compromised asset: ',
          },
          {
            id: 'reputation',
            label: 'Reputation crisis',
            immediateLabel: 'Critical first move',
            immediateAction:
              'Lock down official executive and brand accounts, capture timestamped URLs of impersonator profiles or cloned domains, and centralize external statements through one verified channel.',
            avoidLabel: 'What to avoid',
            avoidAction:
              'Do not publicly argue with burner accounts or amplify malicious links while debunking them—doing so boosts algorithmic reach and alerts adversaries before evidence is collected.',
            prefillText:
              '[Reputation Crisis / Impersonation] Involved URLs, accounts, or domains and brief context: ',
          },
        ],
        reportCaseCta: 'Prefill this scenario in form',
        urgentSignalCta: 'Open encrypted Signal',
      },
      first30: {
        headline: 'First 30 Minutes Containment Protocol',
        subtitle:
          'Four essential technical containment actions before initiating deep account recovery.',
        items: [
          {
            num: '01',
            title: 'Disconnect network without wiping the device',
            desc: 'Turn off Wi-Fi and cellular data on the suspected machine to sever live remote access, but avoid factory-resetting immediately if forensic proof of accessed data is needed.',
          },
          {
            num: '02',
            title: 'Secure your root email and identity first',
            desc: 'Your primary inbox controls password resets across banks, domains, and social accounts. Log in from a clean device, kill open sessions, audit forwarding filters, and rotate 2FA.',
          },
          {
            num: '03',
            title: 'Lock cellular carrier (SIM Swap) and banking',
            desc: 'If mobile signal drops unexpectedly, call your carrier from another phone to block unauthorized SIM/eSIM transfers and place temporary holds on banking or exchange withdrawals.',
          },
          {
            num: '04',
            title: 'Revoke delegated sessions and OAuth tokens',
            desc: 'In operations with agencies, editors, or assistants, breaches often originate on a collaborator’s endpoint. Temporarily suspend shared sessions, third-party apps, and API keys.',
          },
        ],
      },
      reputation: {
        kicker: ['Reputational Containment', 'Impersonation, Defamation & Exposure'],
        headline: 'When the attack targets your name, brand, or credibility',
        body: 'Digital crises are rarely purely technical: cloned domains, fake verified profiles, out-of-context leaks, or coordinated smear campaigns require securing your perimeter while gathering passive intelligence without tipping off adversaries.',
        items: [
          {
            num: '01',
            title: 'Immediate hardening of executive & family accounts',
            desc: 'Rapid lock-down of founders’, partners’, and close relatives’ accounts to prevent secondary takeovers while public attention is elevated.',
          },
          {
            num: '02',
            title: 'Passive origin traceability (OSINT)',
            desc: 'External mapping of lookalike domains, linked infrastructure, and coordinated accounts to measure real exposure prior to legal or PR action.',
          },
          {
            num: '03',
            title: 'Verifiable evidence dossier for takedowns',
            desc: 'Structured technical proof (DNS records, full captures, and public timelines) ready to accelerate platform impersonation takedowns and legal counsel.',
          },
        ],
        primaryCta: 'Coordinate Confidential Containment',
        raptorCta: 'Explore Palantir Raptor OSINT unit',
      },
      hygiene: {
        headline: 'Four Habits That Prevent 90% of Crises',
        subtitle:
          'If you are not facing an active incident today, adopting these baselines drastically shrinks your attack surface.',
        items: [
          {
            num: '01',
            title: 'Isolate banking and recovery email addresses',
            desc: 'Never use the same email listed on press kits, websites, or social bios to log into banks, domain registrars, or vaults. Use dedicated private aliases.',
          },
          {
            num: '02',
            title: 'Replace SMS codes with hardware keys or 2FA apps',
            desc: 'Text-message codes are vulnerable to SIM swapping. Enforce hardware security keys (Passkeys/YubiKey) or encrypted authenticators decoupled from your phone number.',
          },
          {
            num: '03',
            title: 'Delegate access without ever sharing passwords',
            desc: 'Sending credentials over chat or email multiplies breach risk. Use Zero-Knowledge vaults so collaborators log in without seeing passwords or 2FA codes.',
          },
          {
            num: '04',
            title: 'Keep endpoints patched and verify urgent links',
            desc: 'Most session hijacks exploit outdated browsers or fake copyright, support, or investment lures. Verify any urgent login request out-of-band.',
          },
        ],
        auditCta: 'Request preventive audit',
      },
    },
    admin: {
      dialogAria: 'Coto Privado private assessments panel',
      headerTitle: 'Requests — Coto Privado',
      exportCsv: 'Export CSV',
      signOut: 'Sign out',
      closeAria: 'Close panel',
      verifying: 'Verifying credentials...',
      signInTitle: 'Administrative Access',
      signInDesc: 'Sign in with your @coto.lat corporate account to manage audit requests.',
      signInBtn: 'Authenticate with Google',
      signInFailed: 'Could not complete Google sign-in.',
      unauthorizedTitle: 'Unauthorized account',
      unauthorizedPrefix: 'The current session',
      unauthorizedMiddle: 'does not have access. Sign in with a corporate account',
      switchAccountBtn: 'Switch Google account',
      tabs: {
        all: (count) => `All (${count})`,
        pendiente: (count) => `Pending (${count})`,
        en_revision: (count) => `In review (${count})`,
        contactado: (count) => `Contacted (${count})`,
        cerrado: (count) => `Closed (${count})`,
      },
      statusLabels: {
        pendiente: 'Pending',
        en_revision: 'In review',
        contactado: 'Contacted',
        cerrado: 'Closed',
      },
      searchPlaceholder: 'Search by ID, name, role, reference, or notes...',
      clearSearchAria: 'Clear search',
      serviceFilterAria: 'Filter by service',
      serviceAll: 'All services',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'request' : 'requests'}`
          : `${shown} of ${total} requests`,
      selectPrompt: 'Select a row to manage',
      openDossier: 'View details',
      backToList: (count) => `Back to list (${count})`,
      dossierPosition: (index, total) => `Request ${index} of ${total}`,
      prevRequest: 'Previous',
      nextRequest: 'Next',
      emptyFiltered: 'No requests match the current filters.',
      clearFiltersBtn: 'Reset filters',
      serviceLabel: 'Assigned service',
      modeLabel: 'Operating mode',
      dateLabel: 'Submitted on',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      openLinkBtn: 'Open link',
      deleteBtn: 'Delete',
      unsavedNotes: 'Unsaved changes',
      hasNotesTag: 'Internal notes recorded',
      loadingDocs: 'Loading requests...',
      emptyDocs: 'No requests recorded yet.',
      recentFallback: 'Just now',
      confirmDelete: 'Confirm delete',
      cancelDelete: 'Cancel',
      deleteAria: 'Delete request',
      modeAndTier: 'Mode & Service',
      soloShort: 'Solo',
      teamShort: 'Team',
      refLink: 'Reference link or profile',
      reportedConcern: 'Reported concern or incident',
      noComments: 'No additional notes.',
      dossierStatus: 'Dossier status',
      closedLockedMsg: 'Closed dossier (editing locked).',
      reopenBtn: 'Reopen dossier',
      internalNotesLabel: 'Internal follow-up notes',
      internalNotesPlaceholder: 'Record contact context, agreements, or next steps...',
      savingBtn: 'Saving...',
      saveNotesBtn: 'Save notes',
      feedbackSyncError: 'Could not synchronize requests.',
      feedbackStatusUpdated: (label) => `Status updated to ${label}.`,
      feedbackStatusError: 'Failed to update status.',
      feedbackNotesSaved: 'Notes saved.',
      feedbackNotesError: 'Failed to save notes.',
      feedbackDeleteError: 'Failed to delete record.',
    },
  },

  pt: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    raptorMetaTitle: 'Palantir Raptor — Inteligência e Reconhecimento OSINT | Coto Privado',
    crisisMetaTitle: 'Guia contra Invasão e Crise de Reputação | Coto Privado',
    nav: {
      overview: 'Início',
      services: 'Serviços',
      backing: 'Tecnologia',
      crisis: 'Crise',
      evaluation: 'Avaliação',
      cta: 'Solicitar Auditoria',
      ariaMain: 'Navegação principal',
      langSelectorAria: 'Selecionar idioma',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Segurança de nível corporativo simplificada para você.',
      body: 'Protegemos o patrimônio digital, a identidade e as operações de fundadores, criadores e figuras públicas, para que você se concentre no que sabe fazer de melhor.',
      primaryCta: 'Solicitar Auditoria Privada',
      emergencyTrigger: 'Incidente ativo?',
      padlockAria: 'Cadeado de segurança',
    },
    services: {
      headline: 'Nossos Serviços',
      subtitle: 'Dois níveis de proteção conforme a estrutura da sua operação.',
      shieldAria: 'Escudo de segurança',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Alicerce Essencial',
        name: 'Argos',
        audience: 'Para profissionais independentes, fundadores e criadores de conteúdo.',
        items: [
          {
            title: 'Identidade Blindada',
            desc: 'Cofre centralizado de senhas e e-mails alias para ocultar seu rastro digital.',
          },
          {
            title: 'Defesa Silenciosa',
            desc: 'Proteção e atualização automática dos seus dispositivos (PC/Mac/Celular) em segundo plano, sem interromper seu trabalho.',
          },
          {
            title: 'Diagnóstico de Exposição',
            desc: 'Auditoria inicial para detectar se seus dados já estão comprometidos na web.',
          },
        ],
        cta: 'Escolher Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Blindagem Integral',
        name: 'Atlas',
        audience:
          'Para operações de alto perfil que exigem delegar acessos a equipes, agências ou colaboradores.',
        items: [
          {
            title: 'Delegação Zero-Knowledge',
            desc: 'Sua equipe acessa plataformas críticas sem jamais visualizar senhas ou códigos de segurança (2FA).',
          },
          {
            title: 'Vigilância Contínua',
            desc: 'Monitoramento ativo contra sequestro de sessão, falsidade ideológica e vazamento de credenciais na Dark Web.',
          },
          {
            title: 'Resposta a Crises (<30 min)',
            desc: 'Isolamento remoto de dispositivos comprometidos, canal de comunicação criptografado e dossiê imutável para resgate rápido de contas.',
          },
        ],
        cta: 'Escolher Atlas',
      },
      raptorCallout: {
        kicker: ['Divisão Especial', 'Inteligência OSINT'],
        hook: 'Precisa saber o que a pegada pública revela hoje antes de dar um passo crítico? Conheça nossa unidade de reconhecimento externo e passivo.',
        cta: 'Explorar Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Protocolo Aberto', 'Resposta e Contenção'],
        hook: 'Sofreu invasão de conta, tentativa de extorsão ou campanha de falsidade ideológica? Veja as ações críticas dos primeiros 30 minutos.',
        cta: 'Abrir Guia de Crise',
      },
    },
    raptor: {
      nav: {
        backToMain: 'Voltar',
        overview: 'Resumo',
        capabilities: 'Capacidades',
        dossier: 'Dossiê',
        evaluation: 'Avaliação',
        cta: 'Solicitar Inteligência',
      },
      hero: {
        kicker: ['Divisão Especial', 'Execução 100% Externa e Passiva'],
        name: 'Palantir Raptor',
        subtitle: 'Inteligência e Reconhecimento OSINT',
        body: 'Inteligência tática acionável baseada na coleta e análise de fontes abertas (OSINT) para indivíduos e corporações. Execução 100% externa e passiva.',
        primaryCta: 'Solicitar Dossiê OSINT',
        eyeAria: 'Esfera Palantír e farol óptico de observação em cristal furta-cor',
      },
      capabilities: {
        headline: 'Vetores de Reconhecimento',
        subtitle:
          'Coleta e correlação passiva em fontes públicas, registros técnicos e exposição vazada.',
        items: [
          {
            num: '01',
            title: 'Reconhecimento e Identificação',
            desc: 'Perfilamento de pessoas de interesse, investigação de terceiros (due diligence) e rastreabilidade completa da pegada digital.',
          },
          {
            num: '02',
            title: 'Inteligência Competitiva',
            desc: 'Análise do ambiente corporativo, monitoramento de reputação de marca e mapeamento da infraestrutura pública de concorrentes.',
          },
          {
            num: '03',
            title: 'Análise de Risco e Exposição',
            desc: 'Rastreamento profundo de credenciais, documentos confidenciais e dados pessoais vazados na Surface e Dark Web.',
          },
          {
            num: '04',
            title: 'Superfície de Ataque',
            desc: 'Detecção de domínios clonados, campanhas de falsidade ideológica e ativos digitais expostos que representam uma ameaça.',
          },
        ],
      },
      dossier: {
        kicker: ['Entregável Confidencial', 'Zero Interação com o Alvo'],
        title: 'Dossiê Tático',
        body: 'Um relatório de inteligência confidencial com evidências diretas e rotas de mitigação, estruturado a partir da análise de informações públicas, sem alertar nem interagir com a infraestrutura do alvo.',
        cta: 'Coordenar Operação OSINT',
      },
    },
    tech: {
      headline: 'Tecnologia e Respaldo',
      body: 'Operamos sob uma arquitetura de confiança zero impulsionada por líderes do setor: Keeper, Cloudflare, ESET, Action1 e iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Cofre criptográfico',
          desc: 'Criptografia local para credenciais, chaves de acesso e segredos críticos.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perímetro e DNS privado',
          desc: 'Filtragem de rede, túneis criptografados e bloqueio preventivo de phishing.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Proteção de endpoints',
          desc: 'Defesa antimalware leve em macOS e Windows contra infostealers e trojans.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Gestão de vulnerabilidades',
          desc: 'Correção autônoma de falhas em sistemas operacionais, navegadores e apps.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridade móvel',
          desc: 'Detecção avançada de spyware e fortalecimento de segurança no iOS e Android.',
        },
      ],
    },
    form: {
      headline: 'Formulário de Avaliação',
      body: 'Preencha estes dados essenciais — você pode usar um alias — para coordenar seu diagnóstico inicial. Jamais solicitamos senhas ou acesso a dispositivos nesta etapa.',
      raptorHeadline: 'Solicitação de Inteligência — Palantir Raptor',
      raptorBody:
        'Preencha estes dados essenciais — você pode usar um alias — para coordenar o escopo de reconhecimento passivo. Execução confidencial sem alertar nem tocar na infraestrutura.',
      crisisHeadline: 'Registro de Incidente ou Contenção',
      crisisBody:
        'Registre seu caso — você pode usar um alias — para coordenar contenção, recuperação de acessos ou blindagem pós-incidente. Nunca pedimos senhas neste formulário.',
      fields: {
        nameLabel: 'Nome / Alias',
        namePlaceholder: 'Ex.: Martín V. ou alias privado',
        roleLabel: 'Função principal (Ex.: Fundador, Criador, Consultor)',
        rolePlaceholder: 'Fundador, Diretoria, Figura pública...',
        refLabel: 'Link de referência (Site do projeto / Rede social principal)',
        refPlaceholder: 'https://seuprojeto.com ou @perfil',
        modeLabel: 'Você opera sozinho ou delega acessos a uma equipe/agência?',
        modeAria: 'Modalidade operacional',
        soloOption: 'Solo',
        teamOption: 'Equipe',
        concernLabel: 'Você tem alguma preocupação de segurança ou incidente recente?',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve, caso queira compartilhar...',
        submitIdle: 'Solicitar Auditoria Privada',
        raptorSubmitIdle: 'Solicitar Operação Palantir Raptor',
        crisisSubmitIdle: 'Registrar Caso Prioritário',
        submitLoading: 'Enviando solicitação...',
      },
      validation: {
        errorPrefix: 'Erro',
        nameLength: (min, max) => `Informe seu nome ou alias (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Especifique sua função principal (${min} a ${max} caracteres).`,
        refEmpty: 'Compartilhe o link do seu projeto ou perfil principal.',
        refInvalid: 'Insira um domínio válido (ex.: seuprojeto.com) ou usuário (ex.: @usuario).',
        concernMax: (max) => `Máximo de ${max} caracteres.`,
        idGenFailed: 'Não foi possível gerar um identificador seguro. Tente novamente.',
        quotaExceeded:
          'Limite diário do banco de dados atingido. Tente amanhã ou entre em contato por e-mail.',
        genericSubmitError:
          'Ocorreu um problema ao registrar sua solicitação. Verifique sua conexão e tente novamente.',
      },
      confirmation: {
        title: 'Solicitação Privada Registrada',
        folioLabel: 'Código',
        tierLabel: 'Serviço atribuído',
        nameLabel: 'Nome / Alias',
        roleLabel: 'Função principal',
        refLabel: 'Link de referência',
        modeLabel: 'Modalidade',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Equipe',
        downloadBtn: 'Baixar comprovante',
        emailBtn: 'App de e-mail',
        gmailBtn: 'Gmail Web',
        resetBtn: 'Nova solicitação',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        tierDisplayRaptor: 'Palantir Raptor',
        receiptHeader: 'COTO PRIVADO — SOLICITAÇÃO CONFIDENCIAL',
        receiptFolio: 'Código',
        receiptDate: 'Data',
        receiptName: 'Nome / Alias',
        receiptRole: 'Função principal',
        receiptRef: 'Referência',
        receiptMode: 'Modalidade',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Equipe',
        receiptTier: 'Serviço',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Nenhum incidente relatado',
        mailSubjectPrefix: 'Solicitação Confidencial',
        openSignalBtn: 'Abrir Signal',
      },
      signalCard: {
        emergencyToggle: 'Incidente de segurança ativo?',
        emergencyNotice:
          'Via exclusiva para invasões em andamento, sequestro de contas ou extorsão ativa. Para auditorias preventivas ou dúvidas gerais, preencha a avaliação.',
        emergencySignalLabel: 'Linha de emergência',
        emergencySignalSubtitle: 'Canal criptografado no Signal',
        unlockedKicker: (folio) => ['Canais habilitados', `Código ${folio}`],
        unlockedTitle: 'Contato direto habilitado',
        unlockedBody: (folio) =>
          `Seu dossiê está registrado. Fale diretamente pelo Signal ou e-mail com sua referência ${folio} preenchida.`,
        userLabel: 'Canal criptografado Signal',
        signalSubtitle: 'Mensagens diretas de ponta a ponta',
        openSignalBtn: 'Abrir Signal',
        emailLabel: 'E-mail institucional',
        openMailAppBtn: 'App de e-mail',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copiar e-mail',
        copiedEmailBtn: 'E-mail copiado',
        privacyTrigger: 'Compromisso de privacidade e confidencialidade',
      },
    },
    footer: {
      crisisLink: 'Guia de Crise',
      contactTrigger: 'Contato e Emergências',
      privacyLink: 'Privacidade e Confidencialidade',
      privateAccess: 'Acesso Privado',
    },
    privacy: {
      dialogAria: 'Compromisso de privacidade e confidencialidade da Coto Privado',
      kicker: ['Coto Privado', 'Protocolo de Sigilo'],
      title: 'Privacidade e Confidencialidade',
      intro:
        'Cada contato, avaliação ou relato de incidente é conduzido sob estrita discrição operacional e minimização absoluta de dados.',
      clauses: [
        {
          num: '01',
          title: 'Sigilo profissional e acordo NDA',
          desc: 'Toda comunicação, identidade, alias ou contexto compartilhado é protegido por sigilo profissional desde o primeiro contato. Disponibilizamos acordo de confidencialidade (NDA) antes de qualquer escopo técnico.',
        },
        {
          num: '02',
          title: 'Minimização de dados e zero terceiros',
          desc: 'Coletamos apenas os dados mínimos essenciais para coordenar sua avaliação, permitindo o uso de alias. Jamais comercializamos, cedemos ou expomos dados a terceiros, anunciantes ou rastreadores externos.',
        },
        {
          num: '03',
          title: 'Comunicação criptografada e emergências',
          desc: 'Nunca solicitamos senhas, códigos 2FA ou acesso a dispositivos por este site. Para consultas sensíveis ou incidentes ativos, atendemos pelo nosso canal oficial criptografado de ponta a ponta no Signal.',
        },
        {
          num: '04',
          title: 'Retenção controlada e exclusão imediata',
          desc: 'Os registros de avaliação são mantidos exclusivamente para a coordenação do atendimento. Você pode solicitar a exclusão definitiva e imediata de qualquer registro pelo nosso canal no Signal ou pelo e-mail help@coto.lat.',
        },
      ],
      directLabel: 'Canal criptografado direto',
      openSignalBtn: 'Abrir canal no Signal',
      closeBtn: 'Fechar',
      closeAria: 'Fechar aviso de privacidade e confidencialidade',
    },
    emergencyModal: {
      dialogAria: 'Protocolo de resposta a incidentes de segurança ativos',
      kicker: ['Coto Privado', 'Resposta a Crises'],
      title: 'Incidente de segurança ativo?',
      body: 'Via exclusiva para invasões em andamento, sequestro de contas ou extorsão ativa. Comunicação direta criptografada de ponta a ponta sem intermediários.',
      signalLabel: 'Linha de emergência',
      signalSubtitle: 'Canal oficial criptografado no Signal',
      openSignalBtn: 'Abrir Signal',
      crisisGuideCta: 'Ver guia passo a passo contra invasão ou crise',
      preventivePrompt: 'Busca uma auditoria preventiva ou tem dúvidas gerais?',
      preventiveCta: 'Ir ao formulário de avaliação',
      privacyLink: 'Privacidade e confidencialidade',
      closeAria: 'Fechar protocolo de emergência',
    },
    crisisPage: {
      nav: {
        backToMain: 'Voltar',
        overview: 'Diagnóstico',
        first30: 'Primeiros 30 Min',
        reputation: 'Reputação',
        hygiene: 'Blindagem',
        evaluation: 'Contato',
        cta: 'Solicitar Contenção',
      },
      hero: {
        kicker: ['Protocolo de Contenção', 'Segurança e Reputação'],
        headline: 'O que fazer diante de uma invasão ou crise de reputação.',
        body: 'As decisões tomadas nos primeiros 30 minutos definem se um incidente será contido em sigilo ou escalará publicamente. Siga este guia prático antes de formatar dispositivos ou responder sob pressão.',
        primaryCta: 'Registrar Caso no Formulário',
        signalCta: 'Invasão em andamento (Signal)',
      },
      triage: {
        kicker: ['Triagem Rápida', 'Selecione sua situação atual'],
        title: 'Orientação imediata por tipo de incidente',
        tabAria: 'Cenários de crise',
        scenarios: [
          {
            id: 'hack',
            label: 'Sequestro de contas',
            immediateLabel: 'Primeiro passo crítico',
            immediateAction:
              'A partir de outro dispositivo limpo, altere a senha do seu e-mail principal, revogue todas as sessões ativas e verifique se não há regras ocultas de encaminhamento ou aparelhos desconhecidos.',
            avoidLabel: 'O que evitar',
            avoidAction:
              'Não redefina senhas no mesmo computador ou celular onde ocorreu a invasão — se houver um infostealer ativo, você entregará a nova credencial diretamente ao invasor.',
            prefillText:
              '[Sequestro de Contas / Acesso Não Autorizado] Plataforma afetada e horário aproximado do incidente: ',
          },
          {
            id: 'extortion',
            label: 'Extorsão ou vazamento',
            immediateLabel: 'Primeiro passo crítico',
            immediateAction:
              'Preserve capturas completas das mensagens, cabeçalhos de e-mail, carteiras ou perfis remetentes, e corte imediatamente novos acessos encerrando sessões em nuvem e cofres.',
            avoidLabel: 'O que evitar',
            avoidAction:
              'Não realize pagamentos impulsivos nem apague o histórico de mensagens com o extorsionário. Pagar raramente impede o vazamento e costuma gerar novas cobranças.',
            prefillText:
              '[Extorsão / Vazamento de Dados] Canal por onde recebeu a ameaça e tipo de ativo comprometido: ',
          },
          {
            id: 'reputation',
            label: 'Crise de reputação',
            immediateLabel: 'Primeiro passo crítico',
            immediateAction:
              'Proteja os perfis oficiais seus e da diretoria, registre URLs exatas de contas falsas ou domínios clonados com data e hora, e centralize comunicados em um único canal verificado.',
            avoidLabel: 'O que evitar',
            avoidAction:
              'Não discuta publicamente com perfis anônimos nem compartilhe links maliciosos ao tentar desmenti-los: isso amplia o alcance algorítmico e alerta o adversário antes da coleta de provas.',
            prefillText:
              '[Crise de Reputação / Falsidade Ideológica] Links, perfis ou domínios envolvidos e breve contexto: ',
          },
        ],
        reportCaseCta: 'Preencher este cenário no formulário',
        urgentSignalCta: 'Abrir Signal criptografado',
      },
      first30: {
        headline: 'Protocolo dos Primeiros 30 Minutos',
        subtitle:
          'Quatro medidas essenciais de contenção técnica antes de iniciar a recuperação profunda.',
        items: [
          {
            num: '01',
            title: 'Isole a rede sem formatar o dispositivo',
            desc: 'Desative o Wi-Fi e os dados móveis do aparelho suspeito para interromper o acesso remoto ativo, mas evite restaurar de fábrica imediatamente caso precise preservar evidências técnicas.',
          },
          {
            num: '02',
            title: 'Proteja primeiro seu e-mail raiz e identidade',
            desc: 'O e-mail principal controla a recuperação de bancos, domínios e redes sociais. Acesse por um dispositivo seguro, encerre sessões abertas, revise filtros de encaminhamento e renove o 2FA.',
          },
          {
            num: '03',
            title: 'Bloqueie sua linha móvel (SIM Swap) e bancos',
            desc: 'Se o sinal do celular cair sem motivo aparente, contate sua operadora de outro telefone para bloquear trocas não autorizadas de chip/eSIM e congele preventivamente transferências bancárias.',
          },
          {
            num: '04',
            title: 'Revogue acessos delegados e tokens OAuth',
            desc: 'Em operações com agências, editores ou assistentes, a brecha costuma vir do dispositivo de um colaborador. Suspenda temporariamente sessões compartilhadas, integrações e chaves de API.',
          },
        ],
      },
      reputation: {
        kicker: ['Contenção Reputacional', 'Falsidade Ideológica, Difamação e Exposição'],
        headline: 'Quando o ataque mira seu nome, marca ou credibilidade',
        body: 'Uma crise digital raramente é apenas técnica: domínios clonados, perfis falsos verificados, vazamentos fora de contexto ou campanhas coordenadas exigem blindar seu perímetro e coletar inteligência passiva sem alertar o adversário.',
        items: [
          {
            num: '01',
            title: 'Blindagem imediata de porta-vozes e familiares',
            desc: 'Fortalecimento urgente das contas pessoais de fundadores, sócios e familiares diretos para impedir sequestros secundários durante o pico de exposição.',
          },
          {
            num: '02',
            title: 'Rastreabilidade passiva de origem (OSINT)',
            desc: 'Mapeamento externo de domínios espelho, infraestrutura vinculada e contas coordenadas para dimensionar o alcance real antes de medidas jurídicas ou públicas.',
          },
          {
            num: '03',
            title: 'Dossiê técnico para remoção e suporte jurídico',
            desc: 'Estruturação de evidências verificáveis (registros DNS, capturas íntegras e linha do tempo pública) prontas para agilizar remoções por falsidade ideológica.',
          },
        ],
        primaryCta: 'Coordenar Contenção Confidencial',
        raptorCta: 'Conhecer unidade OSINT Palantir Raptor',
      },
      hygiene: {
        headline: 'Quatro Hábitos que Evitam 90% das Crises',
        subtitle:
          'Se você não enfrenta um incidente ativo hoje, adotar estas práticas reduz drasticamente sua superfície de exposição.',
        items: [
          {
            num: '01',
            title: 'Isole seu e-mail financeiro e de recuperação',
            desc: 'Jamais utilize o mesmo e-mail divulgado na imprensa, site ou redes sociais para acessar bancos, domínios ou cofres principais. Use endereços alias exclusivos.',
          },
          {
            num: '02',
            title: 'Substitua códigos via SMS por chaves físicas ou apps 2FA',
            desc: 'Códigos por mensagem de texto são vulneráveis ao SIM Swapping. Utilize chaves físicas de segurança (Passkeys/YubiKey) ou autenticadores criptografados.',
          },
          {
            num: '03',
            title: 'Delegue acessos sem jamais compartilhar a senha',
            desc: 'Enviar senhas por chat ou e-mail para sua equipe multiplica o risco. Utilize cofres Zero-Knowledge onde colaboradores operam sem ver credenciais nem códigos 2FA.',
          },
          {
            num: '04',
            title: 'Mantenha sistemas atualizados e desconfie de urgências',
            desc: 'A maioria dos sequestros de sessão explora navegadores desatualizados ou falsos alertas de suporte, direitos autorais ou investimento.',
          },
        ],
        auditCta: 'Solicitar auditoria preventiva',
      },
    },
    admin: {
      dialogAria: 'Painel privado de avaliações Coto Privado',
      headerTitle: 'Solicitações — Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Sair',
      closeAria: 'Fechar painel',
      verifying: 'Verificando credenciais...',
      signInTitle: 'Acesso Administrativo',
      signInDesc: 'Entre com sua conta corporativa @coto.lat para gerenciar as solicitações.',
      signInBtn: 'Autenticar com Google',
      signInFailed: 'Não foi possível concluir o login com o Google.',
      unauthorizedTitle: 'Conta sem permissão',
      unauthorizedPrefix: 'A sessão atual',
      unauthorizedMiddle: 'não possui acesso. Entre com uma conta corporativa',
      switchAccountBtn: 'Trocar conta do Google',
      tabs: {
        all: (count) => `Todas (${count})`,
        pendiente: (count) => `Pendentes (${count})`,
        en_revision: (count) => `Em revisão (${count})`,
        contactado: (count) => `Contatados (${count})`,
        cerrado: (count) => `Encerrados (${count})`,
      },
      statusLabels: {
        pendiente: 'Pendente',
        en_revision: 'Em revisão',
        contactado: 'Contatado',
        cerrado: 'Encerrado',
      },
      searchPlaceholder: 'Buscar por código, nome, função, referência ou notas...',
      clearSearchAria: 'Limpar busca',
      serviceFilterAria: 'Filtrar por serviço',
      serviceAll: 'Todos os serviços',
      sortNewest: 'Mais recentes',
      sortOldest: 'Mais antigas',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'solicitação' : 'solicitações'}`
          : `${shown} de ${total} solicitações`,
      selectPrompt: 'Selecione uma linha para gerenciar',
      openDossier: 'Ver detalhes',
      backToList: (count) => `Voltar à lista (${count})`,
      dossierPosition: (index, total) => `Solicitação ${index} de ${total}`,
      prevRequest: 'Anterior',
      nextRequest: 'Próxima',
      emptyFiltered: 'Nenhuma solicitação corresponde aos filtros atuais.',
      clearFiltersBtn: 'Limpar filtros',
      serviceLabel: 'Serviço atribuído',
      modeLabel: 'Modalidade operacional',
      dateLabel: 'Data de registro',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      openLinkBtn: 'Abrir link',
      deleteBtn: 'Excluir',
      unsavedNotes: 'Alterações não salvas',
      hasNotesTag: 'Com notas internas registradas',
      loadingDocs: 'Carregando solicitações...',
      emptyDocs: 'Nenhuma solicitação registrada ainda.',
      recentFallback: 'Recente',
      confirmDelete: 'Confirmar exclusão',
      cancelDelete: 'Cancelar',
      deleteAria: 'Excluir solicitação',
      modeAndTier: 'Modalidade e Serviço',
      soloShort: 'Solo',
      teamShort: 'Equipe',
      refLink: 'Link ou perfil de referência',
      reportedConcern: 'Preocupação ou incidente relatado',
      noComments: 'Sem observações adicionais.',
      dossierStatus: 'Status do dossiê',
      closedLockedMsg: 'Expediente encerrado (edição bloqueada).',
      reopenBtn: 'Reabrir expediente',
      internalNotesLabel: 'Notas internas de acompanhamento',
      internalNotesPlaceholder: 'Registre contexto de contato, acordos ou próximos passos...',
      savingBtn: 'Salvando...',
      saveNotesBtn: 'Salvar notas',
      feedbackSyncError: 'Não foi possível sincronizar as solicitações.',
      feedbackStatusUpdated: (label) => `Status atualizado para ${label}.`,
      feedbackStatusError: 'Erro ao atualizar o status.',
      feedbackNotesSaved: 'Notas salvas.',
      feedbackNotesError: 'Não foi possível salvar as notas.',
      feedbackDeleteError: 'Não foi possível excluir o registro.',
    },
  },
};

const LANG_STORAGE_KEY = 'coto_privado_lang';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'es' || stored === 'en' || stored === 'pt') {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'es';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    const rawHash = window.location.hash.replace(/^#/, '').trim().toLowerCase();
    const isRaptor = rawHash === 'palantir-raptor' || rawHash.startsWith('raptor-');
    const isCrisis = rawHash === 'protocolo-crisis' || rawHash.startsWith('crisis-');
    document.title = isRaptor
      ? DICTIONARIES[lang].raptorMetaTitle
      : isCrisis
        ? DICTIONARIES[lang].crisisMetaTitle
        : DICTIONARIES[lang].metaTitle;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
