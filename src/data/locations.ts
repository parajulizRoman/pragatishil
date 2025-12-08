export interface LocalLevel {
    id: string; // unique identifier (often name in English or UUID)
    name_ne: string;
    name_en: string;
    wards: number; // number of wards
}

export interface District {
    id: string;
    name_ne: string; // value to store
    name_en: string;
    local_levels: LocalLevel[];
}

export interface Province {
    id: string;
    name_ne: string; // value to store
    name_en: string;
    districts: District[];
}

// Minimal subset for demonstration/phase 1.
// In a real app, this would be the full data set of 77 districts and 753 local levels.
export const LOCATIONS: Province[] = [
    {
        id: "p1",
        name_ne: "कोशी प्रदेश",
        name_en: "Koshi Province",
        districts: [
            {
                id: "jhapa",
                name_ne: "झापा",
                name_en: "Jhapa",
                local_levels: [
                    { id: "bhadrapur", name_ne: "भद्रपुर नगरपालिका", name_en: "Bhadrapur Municipality", wards: 10 },
                    { id: "damak", name_ne: "दमक नगरपालिका", name_en: "Damak Municipality", wards: 10 },
                    // ... others
                ]
            },
            {
                id: "ilam",
                name_ne: "इलाम",
                name_en: "Ilam",
                local_levels: [
                    { id: "ilam_mun", name_ne: "इलाम नगरपालिका", name_en: "Ilam Municipality", wards: 12 }
                ]
            }
        ]
    },
    {
        id: "p2",
        name_ne: "मधेश प्रदेश",
        name_en: "Madhesh Province",
        districts: [
            {
                id: "dhanusha",
                name_ne: "धनुषा",
                name_en: "Dhanusha",
                local_levels: [
                    { id: "janakpur", name_ne: "जनकपुरधाम उपमहानगरपालिका", name_en: "Janakpurdham Sub-Metropolitan City", wards: 25 }
                ]
            }
        ]
    },
    {
        id: "p3",
        name_ne: "बागमती प्रदेश",
        name_en: "Bagmati Province",
        districts: [
            {
                id: "kathmandu",
                name_ne: "काठमाडौँ",
                name_en: "Kathmandu",
                local_levels: [
                    { id: "ktm_metro", name_ne: "काठमाडौँ महानगरपालिका", name_en: "Kathmandu Metropolitan City", wards: 32 },
                    { id: "kirtipur", name_ne: "कीर्तिपुर नगरपालिका", name_en: "Kirtipur Municipality", wards: 10 },
                    { id: "shankharapur", name_ne: "शंखरापुर नगरपालिका", name_en: "Shankharapur Municipality", wards: 9 }
                ]
            },
            {
                id: "lalitpur",
                name_ne: "ललितपुर",
                name_en: "Lalitpur",
                local_levels: [
                    { id: "lalitpur_metro", name_ne: "ललितपुर महानगरपालिका", name_en: "Lalitpur Metropolitan City", wards: 29 }
                ]
            },
            {
                id: "bhaktapur",
                name_ne: "भक्तपुर",
                name_en: "Bhaktapur",
                local_levels: [
                    { id: "bhaktapur_mun", name_ne: "भक्तपुर नगरपालिका", name_en: "Bhaktapur Municipality", wards: 10 }
                ]
            }
        ]
    },
    {
        id: "p4",
        name_ne: "गण्डकी प्रदेश",
        name_en: "Gandaki Province",
        districts: [
            {
                id: "kaski",
                name_ne: "कास्की",
                name_en: "Kaski",
                local_levels: [
                    { id: "pokhara", name_ne: "पोखरा महानगरपालिका", name_en: "Pokhara Metropolitan City", wards: 33 }
                ]
            }
        ]
    },
    {
        id: "p5",
        name_ne: "लुम्बिनी प्रदेश",
        name_en: "Lumbini Province",
        districts: [
            {
                id: "rupandehi",
                name_ne: "रुपन्देही",
                name_en: "Rupandehi",
                local_levels: [
                    { id: "butwal", name_ne: "बुटवल उपमहानगरपालिका", name_en: "Butwal Sub-Metropolitan City", wards: 19 }
                ]
            }
        ]
    },
    {
        id: "p6",
        name_ne: "कर्णाली प्रदेश",
        name_en: "Karnali Province",
        districts: [
            {
                id: "surkhet",
                name_ne: "सुर्खेत",
                name_en: "Surkhet",
                local_levels: [
                    { id: "birendranagar", name_ne: "वीरेन्द्रनगर नगरपालिका", name_en: "Birendranagar Municipality", wards: 16 }
                ]
            }
        ]
    },
    {
        id: "p7",
        name_ne: "सुदूरपश्चिम प्रदेश",
        name_en: "Sudurpashchim Province",
        districts: [
            {
                id: "kailali",
                name_ne: "कैलाली",
                name_en: "Kailali",
                local_levels: [
                    { id: "dhangadhi", name_ne: "धनगढी उपमहानगरपालिका", name_en: "Dhangadhi Sub-Metropolitan City", wards: 19 }
                ]
            }
        ]
    }
];
