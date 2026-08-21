/**
 * ---------------------------------------------------------------------------
 * SITE CONTENT
 * ---------------------------------------------------------------------------
 * Every piece of copy on the site lives here. Change text without touching a
 * single component. Layout is driven by geometry (see `tokens.ts`), never by
 * the length of the content that happens to be sitting in it today.
 * ---------------------------------------------------------------------------
 */

export const site = {
  /** Shown letter-by-letter in the hero. Keep it short — it is the poster. */
  displayWord: 'PORTFOLIO',
  /** Index of the character in `displayWord` that the face illustration replaces. */
  faceLetterIndex: 5, // P-O-R-T-F-[O]-L-I-O

  eyebrow: 'DESIGNER / ILLUSTRATOR',
  year: '2026',

  firstName: 'GIREESH',
  /**
   * The signature form the hero reveals as the visitor starts scrolling —
   * deliberately separate from `firstName`, which the introduction, the poster
   * and the contact note all use.
   */
  signatureName: 'G K REDDY',
  /** Leave empty until a surname is supplied — the black strip adapts either way. */
  lastName: '',

  /**
   * An invitation, not a job application. "Available to talk" rather than
   * "available for hire" is the whole difference between a personal site and
   * a job board, and it is carried by four words.
   */
  connect: {
    status: 'is available to talk',
    cta: "Let's connect",
    /** Points at the CONTACT section. Swap for a mailto: if you prefer. */
    href: '#contact',
  },

  intro: {
    heading: 'HELLO',
    lede: "Hi, I'm GIREESH.",
    paragraphs: [
      'I design digital experiences that are not just beautiful, but meaningful.',
      "I've worked on dashboards, marketplaces, SaaS platforms, and interactive websites that solve real problems and deliver real impact.",
      "Right now I'm focused on building products that are simple, intuitive and powerful for users across industries.",
    ],
  },

  education: {
    heading: 'EDUCATION',
    items: [
      {
        degree: 'Master of Science in International Business',
        detail: 'Montpellier Business School, France | 2024 – 2026',
      },
      {
        degree: 'Bachelor of Technology in Mechanical Engineering',
        detail: 'Jawaharlal Nehru Technological University | 2019 – 2023',
      },
    ],
  },

  skills: {
    heading: 'SKILLS',
    /**
     * Three columns, two rows, in file order as supplied.
     *
     * Each file carries its own background treatment and it is preserved
     * exactly: Photoshop, Premiere Pro, Claude and Procreate are rounded
     * tiles, Figma is a square black tile, Blender is a bare glyph. Nothing
     * is recoloured, restyled or given an invented container — the only
     * processing was trimming the flat padding the export files carried, so
     * they sit on paper instead of in a white box.
     *
     * `scale` is an optical nudge, not a resize: a bare glyph and a filled
     * tile of identical height do not read as the same size.
     */
    items: [
      { label: 'Photoshop', short: 'Ps', src: '/assets/skills/photoshop.png', scale: 1 },
      { label: 'Premiere Pro', short: 'Pr', src: '/assets/skills/premiere-pro.png', scale: 1 },
      { label: 'Figma', short: 'Fg', src: '/assets/skills/figma.png', scale: 0.96 },
      { label: 'Claude', short: 'Cl', src: '/assets/skills/claude.png', scale: 1 },
      { label: 'Procreate', short: 'Pc', src: '/assets/skills/procreate.png', scale: 1 },
      { label: 'Blender', short: 'Bl', src: '/assets/skills/blender.png', scale: 1.06 },
    ] as { label: string; short: string; src: string | null; scale: number }[],
  },

  /**
   * THE STU — abbreviated on purpose. Do not expand it.
   *
   * Every angle, drop, shadow weight and slant of handwriting is a value here
   * rather than a random seed, because randomness reads as a bug and a
   * decision reads as a hand. Rotations follow the brief: -5 / +1.2 / +4.
   */
  studio: {
    heading: 'THE STU',
    items: [
      {
        quote: "You can't compete with someone who's having fun.",
        author: 'Tiago Forte',
        rotation: -5,
        drop: 0,
        shade: 0.2,
        skew: -0.9,
        indent: 1,
        objectPosition: '50% 50%',
        href: null as string | null,
      },
      {
        quote: 'He who is back again, never quit, quick to sail.',
        author: 'Lil Yachty',
        rotation: 1.2,
        drop: 11,
        shade: 0.6,
        skew: 0.7,
        indent: 0,
        /* The eyes sit high and right of centre — a dead-centre crop puts the
           frame edge through them. */
        objectPosition: '56% 38%',
        href: null as string | null,
      },
      {
        quote:
          'I know of no better life purpose than to perish in attempting the great and the impossible.',
        author: 'Friedrich Nietzsche',
        rotation: 4,
        drop: 3,
        shade: 0.35,
        skew: -0.5,
        indent: 2,
        objectPosition: '50% 50%',
        href: null as string | null,
      },
    ],
  },

  experience: {
    heading: 'EXPERIENCE',
    items: [
      { period: '2023 – Present', role: 'Graphic Designer', company: 'Freelance' },
      { period: '2024 – 2025', role: 'Graphic Designer & Illustrator', company: 'Macbease Inc' },
    ],
  },

  /**
   * The last page. The giant heading IS the button — there is no separate
   * rectangular CTA, the typography is the interface.
   *
   * `href: null` means the CTA acknowledges the click (the heading flips to
   * `acknowledged` for a beat) but goes nowhere yet. Set a mailto:, a Calendly
   * URL, or a contact route and it becomes a real link with the same
   * behaviour. Same rule for the social row: null renders as a muted label
   * holding the composition; a real URL turns it into a link. No invented
   * destinations.
   */
  footer: {
    heading: "Let's connect",
    acknowledged: 'See you there',
    sub: 'Have an idea, a project, or simply want to say hello?',
    /** The ask goes to the inbox. Swap for a Calendly or contact route later. */
    href: 'mailto:kolligireeshkumarreddy@gmail.com',
    marquee: ['GIREESH', 'DESIGNER', 'CREATIVE'],
    /**
     * URLs are the canonical profile paths — the `igsi` and `utm_source=share_via`
     * parameters the share sheet appends are tracking artefacts, not part of the
     * address, and they resolve identically without them.
     *
     * A `null` href renders as a muted label rather than a link, so add Behance
     * or a portfolio here the moment you have one and it lights up on its own.
     */
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gireesh-kumar-reddy-kolli-' as string | null },
      { label: 'Instagram', href: 'https://www.instagram.com/itsgireeshreddy' as string | null },
      { label: 'Email', href: 'mailto:kolligireeshkumarreddy@gmail.com' as string | null },
    ],
  },
} as const

export type Site = typeof site
