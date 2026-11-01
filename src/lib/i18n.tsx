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

export interface CrisisResourceLink {
  name: string;
  desc: string;
  url: string;
}

export interface CrisisScenarioItem {
  id: 'hack' | 'extortion' | 'reputation';
  label: string;
  steps: RaptorCapabilityItem[];
  avoidLabel: string;
  avoidAction: string;
  resources: CrisisResourceLink[];
}

export interface TranslationDictionary {
  metaTitle: string;
  raptorMetaTitle: string;
  crisisMetaTitle: string;
  nav: {
    overview: string;
    services: string;
    pep: string;
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
  pep: {
    kicker: [string, string];
    headline: string;
    body: string;
    scopeLabel: string;
    scopes: [string, string, string, string];
    cta: string;
    pillars: RaptorCapabilityItem[];
    footnote: string;
    raptorPrompt: string;
    raptorCta: string;
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
    pepHeadline: string;
    pepBody: string;
    pepSwitchToGeneral: string;
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
      pepSubmitIdle: string;
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
      tierDisplayPep: string;
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
      protocol: string;
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
      chamberAria: string;
    };
    protocol: {
      kicker: [string, string];
      title: string;
      subtitle: string;
      tabAria: string;
      resourcesTitle: string;
      resourcesNote: string;
      helpPrompt: string;
      helpCta: string;
      scenarios: CrisisScenarioItem[];
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
    metaTitle: '\u2800',
    raptorMetaTitle: '\u2800',
    crisisMetaTitle: '\u2800',
    nav: {
      overview: 'Inicio',
      services: 'Servicios',
      pep: 'Exposición Pública',
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
        hook: 'Reconocimiento externo y pasivo para conocer qué revela hoy tu huella pública.',
        cta: 'Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Protocolo Abierto', 'Respuesta en 30 min'],
        hook: 'Acciones inmediatas y enlaces oficiales ante secuestro de cuentas, extorsión o suplantación.',
        cta: 'Guía de Crisis',
      },
    },
    pep: {
      kicker: ['Protocolo PEP', 'Candidaturas y Exposición Pública'],
      headline: 'Blindaje integral antes y durante la vida pública.',
      body: 'Postular a un cargo de elección, asumir una función pública o presentar declaraciones legales expone tu entorno a doxeo y filtraciones. Reducimos tu superficie de riesgo antes del escrutinio.',
      scopeLabel: 'Alcance',
      scopes: [
        'Candidaturas',
        'Personas Políticamente Expuestas',
        'Cargos públicos',
        'Declaraciones legales',
      ],
      cta: 'Solicitar Blindaje PEP',
      pillars: [
        {
          num: '01',
          title: 'Saneamiento Pre-Candidatura y Anti-Doxeo',
          desc: 'Retiro preventivo de domicilios, teléfonos filtrados, correos históricos y registros en buscadores o brókers de datos antes del anuncio oficial.',
        },
        {
          num: '02',
          title: 'Frontera entre Transparencia Legal y Vida Privada',
          desc: 'Aislamiento técnico entre los datos exigidos por ley y tu infraestructura personal, familiar y patrimonial para evitar extorsión o acoso.',
        },
        {
          num: '03',
          title: 'Blindaje del Núcleo Familiar y Círculo Cercano',
          desc: 'Protección contra robo de línea (SIM Swap), bóvedas y endurecimiento de equipos para cónyuges, hijos y asesores directos.',
        },
        {
          num: '04',
          title: 'Delegación Zero-Knowledge para Campaña y Prensa',
          desc: 'Acceso controlado a redes oficiales para jefes de prensa y agencias sin entregar contraseñas ni códigos 2FA, con revocación instantánea.',
        },
      ],
      footnote:
        'Operación apartidista bajo acuerdo NDA · Cualquier país o jurisdicción electoral',
      raptorPrompt: '¿Qué revela hoy tu huella pública?',
      raptorCta: 'Diagnóstico OSINT previo (Palantir Raptor)',
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
      pepHeadline: 'Evaluación Confidencial — Protocolo PEP',
      pepBody:
        'Coordina el blindaje previo a una candidatura, designación pública o proceso de alta exposición —puedes registrar tu solicitud mediante un alias o representante—. Operación estrictamente reservada bajo acuerdo NDA.',
      pepSwitchToGeneral: 'Cambiar a evaluación general (Argos / Atlas)',
      fields: {
        nameLabel: 'Nombre o alias',
        namePlaceholder: 'Ej. Martín V. o alias privado',
        roleLabel: 'Rol o perfil',
        rolePlaceholder: 'Fundador, Candidato, Figura pública...',
        refLabel: 'Sitio web o perfil principal',
        refPlaceholder: 'https://tuproyecto.com o @perfil',
        modeLabel: 'Estructura operativa',
        modeAria: 'Modalidad operativa',
        soloOption: 'Individual',
        teamOption: 'Con equipo / agencia',
        concernLabel: 'Contexto o inquietud reciente',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve o fecha estimada de transición pública...',
        submitIdle: 'Solicitar Auditoría Privada',
        raptorSubmitIdle: 'Solicitar Operación Palantir Raptor',
        crisisSubmitIdle: 'Registrar Caso Prioritario',
        pepSubmitIdle: 'Solicitar Blindaje PEP',
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
        tierDisplayPep: 'Protocolo PEP',
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
        overview: 'Resumen',
        protocol: 'Protocolo',
        hygiene: 'Prevención',
        evaluation: 'Contacto',
        cta: 'Solicitar Apoyo',
      },
      hero: {
        kicker: ['Recurso Abierto', 'Primeros 30 Minutos'],
        headline: 'Qué hacer ante un hackeo o crisis de reputación.',
        body: 'Una guía práctica de referencia para actuar con criterio en los primeros minutos, preservar evidencia técnica y recuperar el control sin cometer errores irreversibles.',
        primaryCta: 'Consultar protocolo',
        signalCta: 'Emergencia en Signal',
        chamberAria: 'Cámara tridimensional de contención criptográfica en cristal tornasol',
      },
      protocol: {
        kicker: ['Guía por Escenario', 'Acciones y enlaces oficiales'],
        title: 'Pasos específicos según el incidente',
        subtitle:
          'Consulta la ruta correspondiente a tu caso. Incluye los portales oficiales directos para evitar anuncios falsos de soporte.',
        tabAria: 'Escenarios de incidente',
        resourcesTitle: 'Accesos oficiales directos',
        resourcesNote: 'Portales verificados sin intermediarios',
        helpPrompt: '¿El incidente supera tu margen operativo?',
        helpCta: 'Coordinar atención confidencial',
        scenarios: [
          {
            id: 'hack',
            label: 'Secuestro de cuentas',
            steps: [
              {
                num: '01',
                title: 'Corta la red del equipo sospechoso sin formatear',
                desc: 'Apaga Wi-Fi y datos móviles de inmediato. Si entraron por un infostealer (robo de cookies en Mac o Windows), cambiar claves desde ese mismo equipo entregará la nueva contraseña al atacante.',
              },
              {
                num: '02',
                title: 'Asegura tu correo raíz y borra reenvíos ocultos',
                desc: 'Desde otro dispositivo limpio, cambia la clave de tu correo principal, cierra todas las sesiones y revisa Configuración → Reenvío y filtros: suelen dejar reglas silenciosas que copian tus códigos.',
              },
              {
                num: '03',
                title: 'Revoca dispositivos vinculados y permisos OAuth',
                desc: 'En WhatsApp o Telegram entra a Dispositivos vinculados y cierra accesos ajenos. En Google, Apple o Microsoft retira apps de terceros conectadas y cambia tu 2FA de SMS a app autenticadora.',
              },
              {
                num: '04',
                title: 'Descarta SIM Swapping y congela retiros',
                desc: 'Si tu celular quedó de golpe Sin servicio, llama a tu operador desde otra línea para bloquear reposición de chip o eSIM y solicita bloqueo preventivo temporal en tu banca o exchange.',
              },
            ],
            avoidLabel: 'Error crítico a evitar',
            avoidAction:
              'Jamás contrates supuestos "hackers de recuperación" en redes o comentarios: son fraudes secundarios que cobran por adelantado y no tienen acceso a los servidores de ninguna plataforma.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Cerrar sesiones, auditar reenvíos y revocar apps OAuth',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Restablecer acceso oficial y revisar equipos vinculados',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Actividad de inicio de sesión y cierre global en Outlook',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Instagram / Meta Hacked',
                desc: 'Flujo oficial de rescate por selfie o historial de cuenta',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Extorsión o filtración',
            steps: [
              {
                num: '01',
                title: 'Verifica si es una campaña automatizada o real',
                desc: 'Muchos correos citan una contraseña tuya antigua filtrada años atrás para fingir que grabaron tu pantalla. Compruébala en Have I Been Pwned; sin prueba específica, suele ser envío masivo.',
              },
              {
                num: '02',
                title: 'Preserva cabeceras y capturas antes de bloquear',
                desc: 'Si existen archivos o accesos reales comprometidos, no borres el hilo. Guarda capturas completas (usuario, fecha, billetera o URL) y descarga el correo original en formato .eml.',
              },
              {
                num: '03',
                title: 'Corta enlaces compartidos en nube y bóvedas',
                desc: 'Desde un equipo limpio, cierra sesiones abiertas y revisa carpetas o enlaces públicos en Google Drive, iCloud, Dropbox o Notion para frenar cualquier extracción adicional.',
              },
              {
                num: '04',
                title: 'No negocies en caliente ni pagues por impulso',
                desc: 'Transferir fondos rara vez garantiza la eliminación del material y suele marcar al objetivo para nuevas exigencias. Gana tiempo mientras cierras todos los vectores abiertos.',
              },
            ],
            avoidLabel: 'Error crítico a evitar',
            avoidAction:
              'No confrontes ni amenaces al remitente mientras sigas teniendo sesiones activas, carpetas en nube compartidas o respaldos sin asegurar.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Comprobar si la clave citada proviene de una brecha antigua',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Auditar terceros con lectura sobre Gmail y Google Drive',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Solicitar desindexación de datos personales expuestos (doxxing)',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Bloqueo preventivo por huella digital (hash) sin subir el archivo',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Suplantación o reputación',
            steps: [
              {
                num: '01',
                title: 'Respalda evidencia con URL y hora antes de denunciar',
                desc: 'Antes de reportar una cuenta clonada o publicación difamatoria, toma capturas con la URL completa visible y archiva el enlace en Wayback Machine para conservar prueba verificable.',
              },
              {
                num: '02',
                title: 'Localiza el proveedor del dominio espejo',
                desc: 'Si crearon una web falsa con tu nombre o marca, búscala en ICANN Lookup para obtener el correo Abuse del registrador del dominio y repórtala en Google Safe Browsing.',
              },
              {
                num: '03',
                title: 'Blinda las cuentas de tu entorno directo',
                desc: 'En ataques coordinados contra figuras públicas o fundadores, suelen intentar vulnerar a socios, agencias o familiares para extraer chats fuera de contexto. Revisa su 2FA y sesiones.',
              },
              {
                num: '04',
                title: 'Aclara desde tu canal oficial sin citar el ataque',
                desc: 'Si debes prevenir a clientes o audiencia, publica un aviso breve en tus cuentas verificadas sin incluir enlaces ni capturas de los perfiles falsos para no amplificar su alcance.',
              },
            ],
            avoidLabel: 'Error crítico a evitar',
            avoidAction:
              'No abras enlaces sospechosos enviados por desconocidos desde tu red habitual: ciertos sitios de difamación se diseñan como señuelo para capturar tu dirección IP o sesión.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Consultar registrador y contacto Abuse de un dominio clonado',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Reportar dominio falso para activar bloqueo en navegadores',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Congelar copia pública con sello de tiempo antes de su borrado',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Reporte formal por suplantación o difamación en resultados',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Cuatro hábitos que evitan el 90% de los incidentes',
        subtitle: 'Estándar mínimo recomendado cuando no existe una emergencia en curso.',
        items: [
          {
            num: '01',
            title: 'Correo exclusivo para bancos y recuperación',
            desc: 'Usa una dirección privada que nadie conozca únicamente para banca, dominios y bóvedas; deja tu correo público solo para contacto comercial.',
          },
          {
            num: '02',
            title: 'App autenticadora o llave física en lugar de SMS',
            desc: 'Desvincula tus códigos 2FA del número telefónico para que un robo de línea (SIM Swap) no permita restablecer tus cuentas.',
          },
          {
            num: '03',
            title: 'Delegación a equipos sin compartir contraseñas',
            desc: 'Entrega acceso a colaboradores o agencias mediante bóvedas Zero-Knowledge o roles nativos, nunca enviando claves ni códigos por chat.',
          },
          {
            num: '04',
            title: 'Verificación por segunda vía ante urgencias',
            desc: 'Mantén navegadores actualizados y confirma por llamada directa cualquier aviso urgente de soporte, derechos de autor o cambio de cuenta bancaria.',
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
    metaTitle: '\u2800',
    raptorMetaTitle: '\u2800',
    crisisMetaTitle: '\u2800',
    nav: {
      overview: 'Overview',
      services: 'Services',
      pep: 'Public Exposure',
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
        hook: 'External, passive reconnaissance to uncover what public records reveal today.',
        cta: 'Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Open Protocol', 'First 30-Min Response'],
        hook: 'Immediate actions and verified portals for account takeovers, extortion, or impersonation.',
        cta: 'Crisis Guide',
      },
    },
    pep: {
      kicker: ['PEP Protocol', 'Candidacies & Public Exposure'],
      headline: 'Comprehensive shielding before and during public life.',
      body: 'Running for office, assuming a public appointment, or filing statutory asset disclosures exposes your inner circle to doxxing and targeted leaks. We reduce your attack surface ahead of public scrutiny.',
      scopeLabel: 'Scope',
      scopes: [
        'Candidacies',
        'Politically Exposed Persons',
        'Public officials',
        'Statutory disclosures',
      ],
      cta: 'Request PEP Shielding',
      pillars: [
        {
          num: '01',
          title: 'Pre-Candidacy Scrubbing & Anti-Doxxing',
          desc: 'Preemptive removal of home addresses, leaked phone numbers, legacy emails, and data-broker records before any official announcement.',
        },
        {
          num: '02',
          title: 'Boundary Between Legal Disclosure & Private Life',
          desc: 'Technical isolation between mandated public filings and your personal, family, and financial infrastructure to prevent extortion.',
        },
        {
          num: '03',
          title: 'Immediate Family & Inner-Circle Hardening',
          desc: 'Anti-SIM-Swap locks, encrypted vaults, and device hardening for spouses, children, and key advisors.',
        },
        {
          num: '04',
          title: 'Zero-Knowledge Campaign & Press Delegation',
          desc: 'Controlled access to official channels for press teams and agencies without sharing passwords or 2FA codes, with instant revocation.',
        },
      ],
      footnote:
        'Non-partisan execution under mutual NDA · Any country or electoral jurisdiction',
      raptorPrompt: 'What do public records already reveal?',
      raptorCta: 'Pre-candidacy OSINT diagnostic (Palantir Raptor)',
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
      pepHeadline: 'Confidential Assessment — PEP Protocol',
      pepBody:
        'Coordinate preventive shielding ahead of a candidacy, public appointment, or high-scrutiny transition—you may register under an alias or authorized representative. Strictly confidential under NDA.',
      pepSwitchToGeneral: 'Switch to general assessment (Argos / Atlas)',
      fields: {
        nameLabel: 'Name or alias',
        namePlaceholder: 'E.g. Martin V. or private alias',
        roleLabel: 'Role or profile',
        rolePlaceholder: 'Founder, Candidate, Public Figure...',
        refLabel: 'Website or primary profile',
        refPlaceholder: 'https://yourproject.com or @handle',
        modeLabel: 'Operating structure',
        modeAria: 'Operating mode',
        soloOption: 'Individual',
        teamOption: 'With team / agency',
        concernLabel: 'Recent context or concern',
        optionalTag: 'Optional',
        concernPlaceholder: 'Brief context or estimated timeline for public transition...',
        submitIdle: 'Request Private Audit',
        raptorSubmitIdle: 'Request Palantir Raptor Operation',
        crisisSubmitIdle: 'Submit Priority Case',
        pepSubmitIdle: 'Request PEP Shielding',
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
        tierDisplayPep: 'PEP Protocol',
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
        overview: 'Overview',
        protocol: 'Protocol',
        hygiene: 'Prevention',
        evaluation: 'Contact',
        cta: 'Request Support',
      },
      hero: {
        kicker: ['Open Resource', 'First 30 Minutes'],
        headline: 'What to do during a breach or reputation crisis.',
        body: 'A practical reference guide to act calmly in the first minutes, preserve technical evidence, and regain control without making irreversible mistakes.',
        primaryCta: 'Read protocol',
        signalCta: 'Emergency on Signal',
        chamberAria: '3D iridescent crystal cryptographic containment chamber',
      },
      protocol: {
        kicker: ['Scenario Reference', 'Specific steps & official portals'],
        title: 'Specific steps for your situation',
        subtitle:
          'Select the scenario you are facing. Includes verified direct portals so you avoid fake support ads and phishing links.',
        tabAria: 'Incident scenarios',
        resourcesTitle: 'Direct official portals',
        resourcesNote: 'Verified links with zero intermediaries',
        helpPrompt: 'Facing an incident beyond self-remediation?',
        helpCta: 'Coordinate confidential support',
        scenarios: [
          {
            id: 'hack',
            label: 'Account takeover',
            steps: [
              {
                num: '01',
                title: 'Take the suspected device offline without wiping',
                desc: 'Turn off Wi-Fi and cellular immediately. If an infostealer stole your browser cookies on Mac or Windows, resetting passwords on that machine hands the new credentials straight back to the attacker.',
              },
              {
                num: '02',
                title: 'Secure root email and delete hidden forwarding rules',
                desc: 'From a separate clean device, rotate your primary email password, sign out all open sessions, and inspect Settings → Forwarding & Filters—attackers frequently hide rules that copy reset codes.',
              },
              {
                num: '03',
                title: 'Revoke linked devices and third-party OAuth apps',
                desc: 'In WhatsApp or Telegram open Linked Devices and remove unfamiliar sessions. In Google, Apple, or Microsoft revoke connected third-party apps and move 2FA off SMS onto an authenticator app.',
              },
              {
                num: '04',
                title: 'Rule out SIM Swapping and freeze transfers',
                desc: 'If mobile signal suddenly drops to No Service, call your carrier from another phone to lock SIM/eSIM port-outs and place a temporary precautionary hold on banking and exchanges.',
              },
            ],
            avoidLabel: 'Critical mistake to avoid',
            avoidAction:
              'Never pay self-proclaimed "recovery hackers" in comments or DMs—they are secondary advance-fee scams with zero internal access to any platform.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Kill active sessions, audit mail forwarding, and revoke OAuth',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Official access recovery and trusted device management',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Sign-in activity log and global session sign-out for Outlook',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Instagram / Meta Hacked',
                desc: 'Official account recovery and video-selfie verification flow',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Extortion or leak',
            steps: [
              {
                num: '01',
                title: 'Check whether the threat is an automated bluff',
                desc: 'Many extortion emails quote an old password leaked years ago to pretend they recorded your screen. Look up the address on Have I Been Pwned; without concrete proof, it is usually mass spam.',
              },
              {
                num: '02',
                title: 'Preserve full headers and screenshots before blocking',
                desc: 'If real files or accounts are involved, do not delete the thread. Capture full screenshots (handle, timestamp, wallet, or URL) and download the original email as an .eml file.',
              },
              {
                num: '03',
                title: 'Cut shared cloud links and active vault sessions',
                desc: 'From a clean device, terminate open sessions and audit public links or shared folders in Google Drive, iCloud, Dropbox, or Notion to stop further exfiltration.',
              },
              {
                num: '04',
                title: 'Do not negotiate in panic or send impulsive payments',
                desc: 'Paying rarely guarantees deletion and routinely flags victims for repeat demands. Buy time while locking down every exposed account.',
              },
            ],
            avoidLabel: 'Critical mistake to avoid',
            avoidAction:
              'Do not confront or threaten the sender while open sessions, shared cloud folders, or unrotated backups remain accessible.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Check if a quoted password came from an older public breach',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Audit third-party read permissions on Gmail and Drive',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Request de-indexing of exposed personal data (doxxing)',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Hash-based protection for intimate images without uploading files',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Impersonation or reputation',
            steps: [
              {
                num: '01',
                title: 'Archive URLs and timestamps before reporting',
                desc: 'Before filing takedowns against fake profiles or coordinated posts, capture full-URL screenshots and archive the page on Wayback Machine as verifiable evidence.',
              },
              {
                num: '02',
                title: 'Identify the registrar behind lookalike domains',
                desc: 'If someone launched a cloned website under your name or brand, query ICANN Lookup to find the registrar Abuse email and report the URL to Google Safe Browsing.',
              },
              {
                num: '03',
                title: 'Harden accounts across your inner circle',
                desc: 'During targeted campaigns against founders or public figures, attackers often pivot to partners, assistants, or family to leak out-of-context chats. Verify their 2FA and active sessions.',
              },
              {
                num: '04',
                title: 'Publish factual notices without linking the attack',
                desc: 'If you need to warn clients or your audience, post a brief notice on verified channels without quoting or linking fake accounts so you do not amplify their algorithmic reach.',
              },
            ],
            avoidLabel: 'Critical mistake to avoid',
            avoidAction:
              'Never open suspicious links sent by strangers from your home network—some defamation pages act as lures to log your IP address or browser session.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Find the domain registrar and official Abuse contact',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Report phishing or cloned domains for browser-wide warnings',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Freeze a timestamped public snapshot before deletion',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Formal impersonation and legal removal requests in Search',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Four habits that prevent 90% of incidents',
        subtitle: 'Recommended baseline when you are not dealing with an active emergency.',
        items: [
          {
            num: '01',
            title: 'Dedicated private email for banking and recovery',
            desc: 'Use an undisclosed email address strictly for banks, domains, and vaults; keep your public address solely for press and business.',
          },
          {
            num: '02',
            title: 'Authenticator app or hardware key instead of SMS',
            desc: 'Decouple 2FA codes from your phone number so a carrier SIM swap cannot reset your core accounts.',
          },
          {
            num: '03',
            title: 'Team delegation without sharing raw passwords',
            desc: 'Grant access to agencies or staff through Zero-Knowledge vaults or native roles—never send credentials over chat.',
          },
          {
            num: '04',
            title: 'Out-of-band verification for urgent requests',
            desc: 'Keep browsers updated and confirm any urgent support, copyright, or wire-transfer notice via a direct call on a known number.',
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
    metaTitle: '\u2800',
    raptorMetaTitle: '\u2800',
    crisisMetaTitle: '\u2800',
    nav: {
      overview: 'Início',
      services: 'Serviços',
      pep: 'Exposição Pública',
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
        hook: 'Reconhecimento externo e passivo para saber o que sua pegada pública revela hoje.',
        cta: 'Palantir Raptor',
      },
      crisisCallout: {
        kicker: ['Protocolo Aberto', 'Resposta em 30 min'],
        hook: 'Ações imediatas e links oficiais diante de invasão de conta, extorsão ou falsidade.',
        cta: 'Guia de Crise',
      },
    },
    pep: {
      kicker: ['Protocolo PEP', 'Candidaturas e Exposição Pública'],
      headline: 'Blindagem integral antes e durante a vida pública.',
      body: 'Disputar eleições, assumir um cargo público ou apresentar declarações legais expõe seu círculo próximo a doxxing e vazamentos. Reduzimos sua superfície de risco antes do escrutínio.',
      scopeLabel: 'Escopo',
      scopes: [
        'Candidaturas',
        'Pessoas Politicamente Expostas',
        'Cargos públicos',
        'Declarações legais',
      ],
      cta: 'Solicitar Blindagem PEP',
      pillars: [
        {
          num: '01',
          title: 'Saneamento Pré-Candidatura e Anti-Doxxing',
          desc: 'Remoção preventiva de endereços, telefones vazados, e-mails antigos e registros em corretores de dados antes do anúncio oficial.',
        },
        {
          num: '02',
          title: 'Fronteira entre Transparência Legal e Vida Privada',
          desc: 'Isolamento técnico entre os dados exigidos por lei e sua infraestrutura pessoal, familiar e patrimonial para evitar extorsão.',
        },
        {
          num: '03',
          title: 'Blindagem do Núcleo Familiar e Círculo Próximo',
          desc: 'Proteção contra SIM Swap, cofres criptografados e endurecimento de dispositivos para cônjuges, filhos e assessores diretos.',
        },
        {
          num: '04',
          title: 'Delegação Zero-Knowledge para Campanha e Imprensa',
          desc: 'Acesso controlado a redes oficiais para assessoria e agências sem compartilhar senhas nem códigos 2FA, com revogação imediata.',
        },
      ],
      footnote:
        'Atuação apartidária sob acordo NDA · Qualquer país ou jurisdição eleitoral',
      raptorPrompt: 'O que sua pegada pública já revela?',
      raptorCta: 'Diagnóstico OSINT prévio (Palantir Raptor)',
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
      pepHeadline: 'Avaliação Confidencial — Protocolo PEP',
      pepBody:
        'Coordene a blindagem prévia a uma candidatura, nomeação pública ou transição de alta exposição — você pode registrar sob um alias ou representante autorizado. Atendimento sob estrito acordo NDA.',
      pepSwitchToGeneral: 'Alternar para avaliação geral (Argos / Atlas)',
      fields: {
        nameLabel: 'Nome ou alias',
        namePlaceholder: 'Ex.: Martín V. ou alias privado',
        roleLabel: 'Função ou perfil',
        rolePlaceholder: 'Fundador, Candidato, Figura pública...',
        refLabel: 'Site ou perfil principal',
        refPlaceholder: 'https://seuprojeto.com ou @perfil',
        modeLabel: 'Estrutura operacional',
        modeAria: 'Modalidade operacional',
        soloOption: 'Individual',
        teamOption: 'Com equipe / agência',
        concernLabel: 'Contexto ou preocupação recente',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve ou prazo estimado para transição pública...',
        submitIdle: 'Solicitar Auditoria Privada',
        raptorSubmitIdle: 'Solicitar Operação Palantir Raptor',
        crisisSubmitIdle: 'Registrar Caso Prioritário',
        pepSubmitIdle: 'Solicitar Blindagem PEP',
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
        tierDisplayPep: 'Protocolo PEP',
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
        overview: 'Resumo',
        protocol: 'Protocolo',
        hygiene: 'Prevenção',
        evaluation: 'Contato',
        cta: 'Solicitar Apoio',
      },
      hero: {
        kicker: ['Recurso Aberto', 'Primeiros 30 Minutos'],
        headline: 'O que fazer diante de uma invasão ou crise de reputação.',
        body: 'Um guia prático de referência para agir com clareza nos primeiros minutos, preservar evidências técnicas e retomar o controle sem erros irreversíveis.',
        primaryCta: 'Consultar protocolo',
        signalCta: 'Emergência no Signal',
        chamberAria: 'Câmara tridimensional de contenção criptográfica em cristal furta-cor',
      },
      protocol: {
        kicker: ['Guia por Cenário', 'Passos e canais oficiais'],
        title: 'Passos específicos conforme o incidente',
        subtitle:
          'Selecione o cenário correspondente ao seu caso. Inclui links oficiais diretos para evitar anúncios falsos de suporte.',
        tabAria: 'Cenários de incidente',
        resourcesTitle: 'Acessos oficiais diretos',
        resourcesNote: 'Portais verificados sem intermediários',
        helpPrompt: 'O incidente exige suporte técnico dedicado?',
        helpCta: 'Coordenar atendimento confidencial',
        scenarios: [
          {
            id: 'hack',
            label: 'Sequestro de contas',
            steps: [
              {
                num: '01',
                title: 'Desconecte a rede do aparelho suspeito sem formatar',
                desc: 'Desligue Wi-Fi e dados móveis na hora. Se entraram via infostealer (roubo de cookies no Mac ou Windows), trocar senhas nesse mesmo equipamento entregará a nova credencial ao invasor.',
              },
              {
                num: '02',
                title: 'Proteja seu e-mail raiz e apague encaminhamentos ocultos',
                desc: 'Em outro aparelho limpo, altere a senha do e-mail principal, encerre todas as sessões e revise Configurações → Encaminhamento e filtros: invasores costumam esconder regras que copiam códigos.',
              },
              {
                num: '03',
                title: 'Revogue aparelhos conectados e permissões OAuth',
                desc: 'No WhatsApp ou Telegram abra Aparelhos conectados e desconecte acessos estranhos. No Google, Apple ou Microsoft remova apps de terceiros e troque o 2FA de SMS para app autenticador.',
              },
              {
                num: '04',
                title: 'Descarte SIM Swapping e trave transferências',
                desc: 'Se o celular ficou Sem serviço repentinamente, ligue para a operadora de outra linha para bloquear troca de chip/eSIM e peça bloqueio preventivo temporário em bancos e corretoras.',
              },
            ],
            avoidLabel: 'Erro crítico a evitar',
            avoidAction:
              'Jamais pague supostos "hackers de recuperação" em redes sociais: são golpes secundários que cobram adiantado sem qualquer acesso interno às plataformas.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Encerrar sessões, revisar encaminhamentos e revogar OAuth',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Recuperação oficial de acesso e gestão de aparelhos confiáveis',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Histórico de acessos e encerramento global no Outlook',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Instagram / Meta Hacked',
                desc: 'Fluxo oficial de recuperação e validação por vídeo-selfie',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Extorsão ou vazamento',
            steps: [
              {
                num: '01',
                title: 'Verifique se a ameaça é disparo automático antigo',
                desc: 'Muitos e-mails exibem uma senha sua vazada há anos para fingir que gravaram sua tela. Consulte o endereço no Have I Been Pwned; sem prova concreta, costuma ser blefe em massa.',
              },
              {
                num: '02',
                title: 'Preserve cabeçalhos e capturas antes de bloquear',
                desc: 'Se houver arquivos ou acessos reais comprometidos, não apague a conversa. Salve capturas completas (perfil, horário, carteira ou URL) e baixe o e-mail original em formato .eml.',
              },
              {
                num: '03',
                title: 'Corte links públicos em nuvem e sessões abertas',
                desc: 'De um equipamento limpo, encerre sessões ativas e revise pastas ou links compartilhados no Google Drive, iCloud, Dropbox ou Notion para interromper novos downloads.',
              },
              {
                num: '04',
                title: 'Evite pagamentos impulsivos ou resposta sob pressão',
                desc: 'Pagar raramente garante a exclusão do material e costuma gerar novas cobranças. Ganhe tempo enquanto fecha todos os acessos vulneráveis.',
              },
            ],
            avoidLabel: 'Erro crítico a evitar',
            avoidAction:
              'Não confronte nem ameace o remetente enquanto ainda houver sessões abertas, pastas compartilhadas em nuvem ou backups expostos.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Conferir se a senha citada veio de um vazamento antigo',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Auditar permissões de leitura no Gmail e Google Drive',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Solicitar remoção de dados pessoais expostos na busca',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Bloqueio preventivo por hash de imagens íntimas sem enviá-las',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Falsidade ou reputação',
            steps: [
              {
                num: '01',
                title: 'Arquive URLs e horários antes de denunciar',
                desc: 'Antes de pedir a derrubada de perfis falsos ou postagens coordenadas, salve capturas com a URL visível e registre a página no Wayback Machine como prova verificável.',
              },
              {
                num: '02',
                title: 'Identifique o registrador de domínios clonados',
                desc: 'Se criaram um site falso com seu nome ou marca, consulte o ICANN Lookup para localizar o contato Abuse do registrador e denuncie a URL ao Google Safe Browsing.',
              },
              {
                num: '03',
                title: 'Blinde as contas do seu círculo próximo',
                desc: 'Em campanhas contra executivos ou figuras públicas, o alvo seguinte costuma ser sócios, assessoria ou familiares para vazar conversas fora de contexto. Revise o 2FA deles.',
              },
              {
                num: '04',
                title: 'Centralize comunicados sem citar os perfis falsos',
                desc: 'Se precisar alertar clientes ou público, publique uma nota objetiva nos seus canais oficiais sem incluir links ou menções às contas maliciosas para não ampliar o alcance delas.',
              },
            ],
            avoidLabel: 'Erro crítico a evitar',
            avoidAction:
              'Não abra links desconhecidos enviados por terceiros na sua rede pessoal: páginas difamatórias frequentemente servem de isca para capturar seu IP ou sessão.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Identificar o provedor de domínio e e-mail oficial de Abuse',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Denunciar domínio clonado para bloqueio nos navegadores',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Congelar cópia pública com data e hora antes da remoção',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Solicitação formal por falsidade ideológica ou remoção legal',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Quatro hábitos que evitam 90% dos incidentes',
        subtitle: 'Padrão mínimo recomendado quando não há uma emergência em andamento.',
        items: [
          {
            num: '01',
            title: 'E-mail exclusivo para bancos e recuperação',
            desc: 'Mantenha um endereço privado desconhecido pelo público apenas para bancos, domínios e cofres; deixe seu e-mail público restrito a contato comercial.',
          },
          {
            num: '02',
            title: 'App autenticador ou chave física no lugar de SMS',
            desc: 'Desvincule seus códigos 2FA do número de telefone para que golpes de SIM Swap não permitam redefinir suas contas principais.',
          },
          {
            num: '03',
            title: 'Delegação à equipe sem expor senhas',
            desc: 'Conceda acesso a colaboradores ou agências por cofres Zero-Knowledge ou permissões nativas, sem jamais enviar senhas por mensagem.',
          },
          {
            num: '04',
            title: 'Confirmação por segundo canal em pedidos urgentes',
            desc: 'Mantenha navegadores atualizados e valide por ligação direta qualquer aviso urgente de suporte, direitos autorais ou mudança bancária.',
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
