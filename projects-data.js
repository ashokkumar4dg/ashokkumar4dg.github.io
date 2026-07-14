const PROJECTS_DATA = {
    'brand': {
        addingSoon: true,
        category: 'Brand Identity',
        title: 'Identity & Branding Systems',
        role: 'Lead Visual Designer',
        client: 'Startups & Ventures',
        deliverables: 'Vector Logos, Brand Guidelines, Business Stationery',
        challenge: 'Startups often struggle to tell a cohesive visual story. A simple logo is not enough; they need a complete, unified visual system that scales across high-resolution print, merchandise, web, and app headers without losing clarity.',
        strategy: 'I developed fully responsive geometric branding structures. We prioritized custom grid vectors, balanced typographic weights, and a clean monochrome aesthetic. The design ensures crisp reproduction, giving new businesses a solid, premium market presence.',
        palette: ['#09090b', '#fafafa', '#a1a1aa', '#27272a'],
        fontHeading: 'Archivo',
        fontBody: 'Space Grotesk',
        banner: 'assets/project-brand.webp',
        gallery: [
            'assets/project-brand.webp'
        ]
    },
    'social': {
        category: 'Social Media',
        title: 'Social Media Creative Campaign',
        role: 'Social Media Graphic Designer',
        client: 'Marketing Agencies',
        deliverables: 'Instagram/LinkedIn Post Templates, Slide Carousels',
        challenge: 'With social media platforms suffering from sensory overload, creative assets must capture scroll-stopping attention within 1.5 seconds while maintaining grid consistency and brand recognition.',
        strategy: 'I optimized visual hierarchies by implementing high-contrast editorial blocks, spacious margins, and clear focal graphics. Carousels are structured around marketing hook frameworks to maximize scroll retention and profile click-throughs.',
        palette: ['#fafafa', '#a1a1aa', '#ff5a5f', '#18181b'],
        fontHeading: 'Space Grotesk',
        fontBody: 'Archivo',
        banner: 'assets/Social Media Posts/Socialmedia1.webp',
        gallery: [
            'assets/Social Media Posts/Socialmedia1.webp',
            'assets/Social Media Posts/Socialmedia2.webp',
            'assets/Social Media Posts/Socialmedia3.webp',
            'assets/Social Media Posts/Socialmedia4.webp',
            'assets/Social Media Posts/Socialmedia5.webp',
            'assets/Social Media Posts/Socialmedia6.webp',
            'assets/Social Media Posts/Socialmedia7.webp'
        ]
    },
    'book': {
        category: 'Book Cover Layout',
        title: 'Premium Book Cover Layouts',
        role: 'Cover & Print Designer',
        client: 'Independent Authors',
        deliverables: 'Front & Back Covers, Spines, Digital E-Book Covers',
        challenge: 'Book covers must instantly telegraph their genre and tone while standing out as readable thumbnails in digital stores, and meeting strict physical print CMYK specifications.',
        strategy: 'I created heavy typographic-driven designs featuring strong visual metaphors. Spine sizing calculations and bleed margins were locked to millimeter precision, blending hand-designed textures with modern, conceptual vector shapes.',
        palette: ['#c29f63', '#1e293b', '#fafafa', '#0f172a'],
        fontHeading: 'Archivo',
        fontBody: 'Space Grotesk',
        banner: 'assets/Book Cover/mansoonmemoriesFront.webp',
        isMasterDetail: true,
        items: [
            {
                id: 'monsoon-memories',
                title: 'Monsoon Memories',
                subtitle: 'Romance / Drama Novel Cover',
                description: 'A beautiful visual layout designed for a romance/drama novel. The design focuses on soft watercolor textures, high-end editorial fonts, and clean margins.',
                genre: 'Fiction / Drama',
                publisher: 'Self-published',
                year: '2025',
                gallery: [
                    'assets/Book Cover/mansoonmemoriesFront.webp',
                    'assets/Book Cover/mansoonmemoriesBack.webp',
                    'assets/Book Cover/mansoonmemories1.webp',
                    'assets/Book Cover/mansoonmemories2.webp',
                    'assets/Book Cover/mansoonmemories3.webp',
                    'assets/Book Cover/mansoonmemories4.webp',
                    'assets/Book Cover/mansoonmemories5.webp'
                ]
            },
            {
                id: 'arriving-soon-book',
                title: 'Upcoming Poetry Anthology',
                subtitle: 'Minimalist Cover Layout',
                description: 'An editorial cover layout combining hand-designed ink textures with minimal structural geometry.',
                genre: 'Poetry & Art',
                publisher: 'Creative Press',
                year: '2026',
                addingSoon: true,
                gallery: []
            }
        ]
    },
    'web': {
        category: 'UI/UX Design',
        title: 'UI/UX & Vibe-Coded Web Designs',
        role: 'UI/UX & Frontend Designer',
        client: 'Vercel Deployments / Client Projects',
        deliverables: 'Wireframes, Hi-Fi Mockups, Responsive UI Layouts, Interactive Web Prototypes',
        challenge: 'Portfolios and commercial landing pages often fail to convert visitors due to boring, static grids, slow performance, or overly complicated navigation blocks. The challenge was to create interactive, lightweight, yet highly visual web portals.',
        strategy: 'I designed a series of high-converting web interfaces utilizing responsive editorial grids, glassmorphism, custom light mode / dark mode controls, and quick action WhatsApp triggers. The projects feature customized student dashboards (Pragya Classes, Pixels Computers), e-commerce skin product flows (Man Series), and clinical diagnostic testing portals (Lucky Laboratory).',
        palette: ['#000000', '#ffffff', '#22c55e', '#18181b'],
        fontHeading: 'Space Grotesk',
        fontBody: 'Space Grotesk',
        banner: 'assets/fullscreenshot-manseries.webp',
        gallery: [
            'assets/fullscreenshot-manseries.webp',
            'assets/fullscreenshot-pragyaclasses.webp',
            'assets/fullscreenshot-pixelscomputers.webp',
            'assets/fullscreenshot-lucky.webp'
        ],
        galleryLinks: [
            'https://manseries.in/',
            'https://pragya-classes.vercel.app/',
            'https://pixels-computers.vercel.app/',
            'https://lucky-laboratory.vercel.app/'
        ],
        galleryTitles: [
            'Man Series',
            'Pragya Classes',
            'Pixels Computers',
            'Lucky Laboratory'
        ],
        fullScreenshots: [
            'assets/fullscreenshot-manseries.webp',
            'assets/fullscreenshot-pragyaclasses.webp',
            'assets/fullscreenshot-pixelscomputers.webp',
            'assets/fullscreenshot-lucky.webp'
        ]
    },
    'poster': {
        category: 'Poster Art',
        title: 'Creative Poster Design Showcase',
        role: 'Graphic / Poster Designer',
        client: 'Personal & Creative Projects',
        deliverables: 'Print Layouts, Digital Creative Post Art, Typography Systems',
        challenge: 'Designing print poster layouts requires balancing strong artistic metaphors with clean geometric spaces, high-contrast typography hierarchy, and a structured layout that communicates the design concept instantly.',
        strategy: 'I designed a series of Swiss-inspired posters combining bold grid divisions, clean vector elements, and geometric typography. These assets explore the relationship between positive and negative space in graphic communication.',
        palette: ['#000000', '#ffffff', '#f4f4f5', '#a1a1aa'],
        fontHeading: 'Archivo',
        fontBody: 'Space Grotesk',
        banner: 'assets/project-poster.webp',
        isMasterDetail: true,
        items: [
            {
                id: 'swiss-grid',
                title: 'Swiss Typographic Grid',
                subtitle: 'Silkscreen Exhibition Poster',
                description: 'A visual experiment focusing on Swiss typographic grid systems, high-contrast typography, and clean geometry.',
                genre: 'Editorial / Print',
                publisher: 'Creative Exhibition',
                year: '2025',
                gallery: [
                    'assets/project-poster.webp'
                ]
            },
            {
                id: 'upcoming-poster',
                title: 'Upcoming Graphic Art Poster',
                subtitle: 'Exhibition Design System',
                description: 'A graphic art poster layout exploring light emission themes, modern color spaces, and visual physics.',
                genre: 'Digital Art',
                publisher: 'Self-initiated',
                year: '2026',
                addingSoon: true,
                gallery: []
            }
        ]
    },
    'invitation': {
        category: 'Print Design',
        title: 'Premium Invitation Layouts',
        role: 'Graphic & Print Designer',
        client: 'Private Commissions',
        deliverables: 'Custom Stationery Design, Foil Print Cards, Layout Guides',
        challenge: 'Event invitation cards must communicate crucial details clearly while establishing a premium, celebratory tone. They require strict print specifications, exact bleed math, and card texture pairing selections.',
        strategy: 'I designed bespoke editorial layout concepts blending luxurious serif headings with neat, spacious details. I utilized a champagne-gold and off-white color palette to represent high elegance and print value.',
        palette: ['#c5a880', '#2d3748', '#fafafa', '#edf2f7'],
        fontHeading: 'Playfair Display',
        fontBody: 'Space Grotesk',
        banner: 'assets/Invitation Card/WeddingCard1.webp',
        isMasterDetail: true,
        items: [
            {
                id: 'wedding-invitation',
                title: 'Bespoke Wedding Invitation',
                subtitle: 'Typographic Foil Print Card',
                description: 'A luxurious wedding invitation card designed using gold foil print specifications, elegant serif headers, and fine textured cardstocks.',
                genre: 'Foil / Print',
                publisher: 'Private Commission',
                year: '2025',
                gallery: [
                    'assets/Invitation Card/WeddingCard1.webp'
                ]
            },
            {
                id: 'anniversary-invitation',
                title: 'Elegant Anniversary Invitation',
                subtitle: 'Champagne-Gold Celebration Layout',
                description: 'An anniversary celebration invitation card with a minimalist editorial layout and clean geometric margins.',
                genre: 'Stationery / Print',
                publisher: 'Private Commission',
                year: '2025',
                gallery: [
                    'assets/Invitation Card/AnniverseryCard1.webp'
                ]
            }
        ]
    }
};

// Make it available on window object for browser access
if (typeof window !== 'undefined') {
    window.PROJECTS_DATA = PROJECTS_DATA;
}
