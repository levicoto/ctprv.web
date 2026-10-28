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

export interface TranslationDictionary {
  metaTitle: string;
  raptorMetaTitle: string;
  nav: {
    overview: string;
    services: string;
    backing: string;
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
    nav: {
      overview: 'Inicio',
      services: 'Servicios',
      backing: 'Respaldo',
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
    nav: {
      overview: 'Overview',
      services: 'Services',
      backing: 'Technology',
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
    nav: {
      overview: 'Início',
      services: 'Serviços',
      backing: 'Tecnologia',
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
    const isRaptor = window.location.hash.replace(/^#/, '').startsWith('palantir-raptor');
    document.title = isRaptor ? DICTIONARIES[lang].raptorMetaTitle : DICTIONARIES[lang].metaTitle;
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
