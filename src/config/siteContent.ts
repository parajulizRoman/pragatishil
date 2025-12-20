export const siteContent = {
    hero: {
        pillNe: "Pragatishil Loktantrik", // Swapped to generic or Party Name
        titleNe: "प्रगतिशील लोकतान्त्रिक पार्टीमा स्वागत छ",
        titleEn: "Welcome to Pragatishil Loktantrik Party",
        subtitleNe: "नेपाली माटो, हाम्रो बाटो", // Updated as requested
        subtitleEnLine1: "Progressive socialist, democratic alternative for Nepal.",
        subtitleEnLine2: "Rooted in Nepali soil, walking our own path with justice, inclusion and good governance.",
        ctaPrimary: "Join the Movement",
        ctaSecondary: "View Members",
    },
    nav: {
        home: { en: "Home", ne: "गृहपृष्ठ" },
        news: { en: "News", ne: "समाचार" },
        media: { en: "Media", ne: "मिडिया" },
        about: { en: "About", ne: "हाम्रो बारेमा" },
        contact: { en: "Contact", ne: "सम्पर्क" },
        members: { en: "Members", ne: "सदस्यहरू" },
        join: { en: "Join Movement", ne: "अभियानमा जोडिनुहोस्" },
        brand: {
            firstEn: "Pragatishil", secondEn: "Loktantrik",
            firstNe: "प्रगतिशील", secondNe: "लोकतान्त्रिक"
        },
        tools: {
            dateConverter: { en: "Date Converter", ne: "मिति परिवर्तन" }
        }
    },
    vision: {
        titleNe: "हाम्रो दृष्टिकोण",
        titleEn: "Our Vision",
        textNe: "हामी एक समतामूलक समाजको परिकल्पना गर्छौं जहाँ प्रत्येक नागरिकले समान अवसर, न्याय र सम्मान पाउँछन्।",
        textEn: "We envision an equitable society where every citizen enjoys equal opportunities, justice, and dignity.",
        pillars: [
            {
                titleNe: "प्रगतिशील समाजवाद",
                titleEn: "Progressive Socialism",
                descEn: "Our guiding ideology – combining social justice, democracy and modern development.",
                icon: "🤝"
            },
            {
                titleNe: "लोकतन्त्रिक मूल्यहरू",
                titleEn: "Democratic Values",
                descEn: "Multi-party democracy, civil liberties, rule of law and accountable institutions.",
                icon: "🗳️"
            },
            {
                titleNe: "समावेशी नेतृत्व",
                titleEn: "Inclusive Leadership",
                descEn: "Youth, women and marginalized communities at every level of party leadership.",
                icon: "👥"
            },
            {
                titleNe: "आधुनिक एजेन्डा",
                titleEn: "Gen Z & Modern Agendas",
                descEn: "Addressing the concerns of new generations – jobs, innovation, climate, digital rights.",
                icon: "🚀"
            },
            {
                titleNe: "संघीयता र जिम्मेवार राष्ट्रवाद",
                titleEn: "Federalism & Nationalism",
                descEn: "Strong federalism and national unity, opposing ultra-nationalism and exclusion.",
                icon: "🇳🇵"
            },
            {
                titleNe: "भ्रष्टाचार विरुद्ध शून्य सहनशीलता",
                titleEn: "End Corruption",
                descEn: "Transparent governance, clean politics and strict action against corruption.",
                icon: "🚫"
            }
        ]
    },
    about: {
        titleNe: "हाम्रो बारेमा",
        titleEn: "About Us",
        descriptionNe: "प्रगतिशील लोकतान्त्रिक पार्टी नेपालको राजनीतिक परिदृश्यमा एक वैकल्पिक शक्तिको रूपमा उदाएको छ। हामी परम्परागत राजनीतिको सीमालाई तोड्दै विज्ञान, प्रविधि र मानवीय मूल्यमान्यतामा आधारित नयाँ राजनीतिक संस्कृतिको विकास गर्न चाहन्छौं।",
        descriptionEn: "The Pragatishil Loktantrik Party (PDP) has emerged as an alternative force in Nepal's political landscape. Breaking the boundaries of traditional politics, we aim to develop a new political culture based on science, technology, and human values.",
    },
    news: [
        {
            id: 1,
            title: "वैचारिक खडेरीको कालखण्ड (A Period of Ideological Drought)",
            title_ne: "वैचारिक खडेरीको कालखण्ड",
            summary_en: "A critical analysis of the current ideological drought in Nepali politics and the search for a progressive alternative.",
            summary_ne: "नेपाली राजनीतिमा जारी वैचारिक खडेरीको विश्लेषण र वैकल्पिक मार्गको खोजी।",
            source: "OnlineKhabar",
            date: "2024-08-25",
            type: "Article",
            link: `/news/view?url=${encodeURIComponent("https://www.onlinekhabar.com/2025/08/1743950/a-period-of-ideological-drought")}`,
            image: "https://www.onlinekhabar.com/wp-content/uploads/2025/08/Baicharik-Khareri-1024x683.jpg",
            image_url: null,
            status: 'published',
            author_name: "Political Analyst",
            published_at: "2024-08-25T00:00:00Z"
        },
        {
            id: 2,
            title: "Pragatishil Party Manifesto Launch",
            title_ne: "प्रगतिशील पार्टीको घोषणापत्र सार्वजनिक",
            summary_en: "The party officially releases its comprehensive manifesto for social reform and economic justice.",
            summary_ne: "पार्टीले सामाजिक सुधार र आर्थिक न्यायका लागि आफ्नो वृहत् घोषणापत्र सार्वजनिक गरेको छ।",
            source: "Kantipur",
            date: "2024-06-15",
            type: "Article",
            link: `/news/view?url=${encodeURIComponent("https://ekantipur.com")}`,
            image: "https://picsum.photos/800/600?random=10",
            image_url: null,
            status: 'published',
            author_name: "Central Committee",
            published_at: "2024-06-15T00:00:00Z"
        },
        {
            id: 3,
            title: "Chairman Interview: The Way Forward",
            title_ne: "अध्यक्षसँगको अन्तर्वार्ता: आगामी बाटो",
            summary_en: "Chairman discusses our strategy for local empowerment and national development.",
            summary_ne: "अध्यक्षले स्थानीय सशक्तिकरण र राष्ट्रिय विकासका लागि हाम्रो रणनीतिबारे चर्चा गर्नुभएको छ।",
            source: "The Kathmandu Post",
            date: "2024-07-01",
            type: "Interview",
            link: `/news/view?url=${encodeURIComponent("https://kathmandupost.com")}`,
            image: "https://picsum.photos/800/600?random=11",
            image_url: null,
            status: 'published',
            author_name: "Editor",
            published_at: "2024-07-01T00:00:00Z"
        }
    ],
    videos: [
        {
            id: "vid1",
            title: "Pragatishil Party Video 1",
            url: "https://www.youtube.com/watch?v=XusiP06Z_lg",
            embed_url: "https://www.youtube.com/embed/XusiP06Z_lg",
        },
        {
            id: "vid2",
            title: "Pragatishil Party Video 2",
            url: "https://www.youtube.com/watch?v=2-SkP3SIrKk",
            embed_url: "https://www.youtube.com/embed/2-SkP3SIrKk",
        },
        {
            id: "vid3",
            title: "Pragatishil Party Video 3",
            url: "https://www.youtube.com/watch?v=TUMNWhBYfxs",
            embed_url: "https://www.youtube.com/embed/TUMNWhBYfxs",
        }
    ],
    galleryImages: [
        { id: 1, url: "https://picsum.photos/800/600?random=1", caption: "Rally in Chitwan", caption_ne: "चितवनमा र्‍याली", alt_text: "Social movement rally" },
        { id: 2, url: "https://picsum.photos/800/600?random=2", caption: "Youth Conference", caption_ne: "युवा सम्मेलन", alt_text: "Youth leaders gathering" },
        { id: 3, url: "https://picsum.photos/800/600?random=3", caption: "Policy Workshop", caption_ne: "नीति कार्यशाला", alt_text: "Political policy discussion" },
        { id: 4, url: "https://picsum.photos/800/600?random=4", caption: "Community Service", caption_ne: "सामुदायिक सेवा", alt_text: "Party members during service" },
    ],
    contact: {
        address: "Baneshwor, Kathmandu, Nepal",
        email: "info@pragatishil.org.np",
        phone: "+977-1-4XXXXXX",
    },
    social: [
        { name: "Facebook", icon: "facebook", url: "https://facebook.com" },
        { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
        { name: "YouTube", icon: "youtube", url: "https://youtube.com" },
        { name: "Instagram", icon: "instagram", url: "https://instagram.com" },
        { name: "TikTok", icon: "tiktok", url: "https://tiktok.com" },
    ],
    footer: {
        taglineNe: "नेपाली माटो, हाम्रो बाटो",
        taglineEn: "Building a just, progressive and prosperous Nepal from our own soil."
    }
};
