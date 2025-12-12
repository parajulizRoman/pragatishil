"use client";

import { useState, useEffect, useMemo } from "react";
import { BrandButton } from "@/components/BrandButton";
import Image from "next/image";
// import { LOCATIONS } from "@/data/locations"; // Removed static import
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { NestedProvince } from "@/lib/geo";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";


// Hardcoded departments matching DB schema where possible or generic list
const DEPARTMENTS = [
    { id: "organization", name: "संगठन विभाग (Organization)" },
    // ... items
];

interface JoinFormData {
    // Personal derived from payload types manually or intersection
    fullNameNe: string;
    fullNameEn: string;
    gender: string; // legacy
    genderCode: "male" | "female" | "third_gender" | "prefer_not_to_say" | "self_described";
    genderRaw: string;
    genderLabelNe: string;
    genderLabelEn: string;

    inclusionGroups: string[];
    inclusionGroupsNe: Record<string, string>;
    inclusionGroupsEn: Record<string, string>;
    inclusionRaw: string;

    dobOriginal: string;
    dobCalendar: string;

    // Location breakdown (not all in payload personal)
    provinceNe: string;
    districtNe: string;
    localLevelNe: string;
    ward: string;
    toleNe: string;
    addressNe: string; // Combined?

    // IDs
    provinceId?: string;
    districtId?: string;
    localLevelId?: string;
    citizenshipNumber?: string;

    // Contact
    phone: string;
    email: string;

    // Party
    skillsText: string;
    pastAffiliations: string;
    motivationTextNe: string;
    motivationTextEn: string;
    departmentIds: string[];
    inspiredBy: string;
    confidentiality: "public_ok" | "keep_private";

    // Photos
    idImageUrl: string;
    profileImageUrl: string;

    // Extracted
    extracted: Record<string, string | null | undefined>;
}

const GENDER_OPTIONS = [
    { code: "male", labelNe: "पुरुष", labelEn: "Male" },
    { code: "female", labelNe: "महिला", labelEn: "Female" },
    { code: "third_gender", labelNe: "तेस्रो लिङ्ग / विविध लैंगिक", labelEn: "LGBTQI+" },
    { code: "prefer_not_to_say", labelNe: "भन्न चाहिन्न", labelEn: "Prefer not to say" },
    { code: "self_described", labelNe: "अन्य", labelEn: "Self described" }
] as const;

const INCLUSION_OPTIONS = [
    { code: "khas_arya", labelNe: "खस आर्य", labelEn: "Khas Arya" },
    { code: "adivasi_janajati", labelNe: "आदिवासी जनजाति", labelEn: "Adivasi Janajati" },
    { code: "madhesi", labelNe: "मधेसी समुदाय", labelEn: "Madhesi" },
    { code: "tharu", labelNe: "थारु समुदाय", labelEn: "Tharu" },
    { code: "dalit", labelNe: "दलित", labelEn: "Dalit" },
    { code: "muslim", labelNe: "मुस्लिम", labelEn: "Muslim" },
    { code: "person_with_disability", labelNe: "अपांगता भएका व्यक्ति", labelEn: "Person with Disability" },
    { code: "senior_citizen", labelNe: "जेष्ठ नागरिक", labelEn: "Senior Citizen" },
    { code: "women", labelNe: "महिला", labelEn: "Women" },
    { code: "sexual_gender_minority", labelNe: "यौनिक तथा लैङ्गिक अल्पसंख्यक", labelEn: "Sexual/Gender Minority" },
    { code: "other_minority", labelNe: "अन्य अल्पसंख्यक", labelEn: "Other Minority" },
    { code: "other_specified", labelNe: "अन्य (विवरण दिनुहोस्...)", labelEn: "Other (Specify...)" }
] as const;

export default function JoinPage() {
    // -- UI State --
    const [loadingScan, setLoadingScan] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // -- Cropper State --
    const [tempImgSrc, setTempImgSrc] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // -- Member ID Generation (Client Side) for Deterministic Paths --
    const [memberId, setMemberId] = useState<string>("");

    useEffect(() => {
        // Generate UUID on mount
        if (typeof window !== "undefined") {
            setMemberId(self.crypto.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36));
        }
    }, []);

    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFormData(prev => ({
                    ...prev,
                    email: user.email || prev.email,
                    fullNameEn: user.user_metadata?.full_name || prev.fullNameEn,
                    // If we wanted to map name to Nepali field we could, but better to keep separate
                }));
            }
        };
        checkUser();
    }, [supabase]);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/join` : undefined,
            }
        });
    };

    // -- Form Data State --
    const [formData, setFormData] = useState<JoinFormData>({
        fullNameNe: "",
        fullNameEn: "",

        // Gender
        gender: "male", // Legacy
        genderCode: "male", // Default
        genderRaw: "",
        genderLabelNe: "पुरुष",
        genderLabelEn: "Male",

        // Inclusion
        inclusionGroups: [],
        inclusionGroupsNe: {},
        inclusionGroupsEn: {},
        inclusionRaw: "",

        dobOriginal: "",
        dobCalendar: "BS",

        // Location
        provinceNe: "",
        districtNe: "",
        localLevelNe: "",
        addressNe: "",
        ward: "",
        toleNe: "",
        // IDs are separate from payload usually, but let's keep them in state if needed
        // provinceId: "", districtId: "", localLevelId: "", -> handled separately in state variables if not in payload

        // Contact
        phone: "",
        email: "",

        // Extra Fields not in 'personal' strict payload but needed for form
        departmentIds: [],
        skillsText: "",
        pastAffiliations: "",
        motivationTextNe: "",
        motivationTextEn: "",
        inspiredBy: "",
        confidentiality: "public_ok",
        idImageUrl: "",
        profileImageUrl: "",
        extracted: {}
    });



    // -- Geo Data Fetching --
    const [geoStructure, setGeoStructure] = useState<NestedProvince[]>([]);
    const [loadingGeo, setLoadingGeo] = useState(true);

    useEffect(() => {
        async function fetchGeo() {
            try {
                const res = await fetch("/api/geo/structure");
                const data = await res.json();
                if (data.provinces) {
                    setGeoStructure(data.provinces);
                }
            } catch (error) {
                console.error("Failed to load geo structure", error);
            } finally {
                setLoadingGeo(false);
            }
        }
        fetchGeo();
    }, []);

    // -- Derived Location Options --
    const provinces = geoStructure;

    const districts = useMemo(() => {
        const prov = provinces.find(p => String(p.id) === String(formData.provinceId));
        return prov ? prov.districts : [];
    }, [formData.provinceId, provinces]);

    const localLevels = useMemo(() => {
        const dist = districts.find(d => String(d.id) === String(formData.districtId));
        return dist ? dist.localLevels : [];
    }, [formData.districtId, districts]);

    // Dynamic Ward Options
    const wardOptions = useMemo(() => {
        if (!formData.localLevelId) return [];
        const ll = localLevels.find(l => String(l.id) === String(formData.localLevelId));
        if (!ll || !ll.num_wards) return [];
        return Array.from({ length: ll.num_wards }, (_, i) => i + 1);
    }, [formData.localLevelId, localLevels]);


    // -- Handlers --

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provId = e.target.value;
        const prov = provinces.find(p => String(p.id) === provId);
        setFormData(prev => ({
            ...prev,
            provinceId: provId,
            provinceNe: prov ? prov.name_en : "", // Using English name as label usually, but schema has name_en. 
            // Ideally we'd have name_ne in DB, but prompt schema only showed `name_en`.
            // Wait, schema in request had `name_en`. 
            // I'll use `name_en` for now as requested.
            districtId: "",
            districtNe: "",
            localLevelId: "",
            localLevelNe: "",
            ward: ""
        }));
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const distId = e.target.value;
        const dist = districts.find(d => String(d.id) === distId);
        setFormData(prev => ({
            ...prev,
            districtId: distId,
            districtNe: dist ? dist.name_en : "",
            localLevelId: "",
            localLevelNe: "",
            ward: ""
        }));
    };

    const handleLocalLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const llId = e.target.value;
        const ll = localLevels.find(l => String(l.id) === llId);
        setFormData(prev => ({
            ...prev,
            localLevelId: llId,
            localLevelNe: ll ? ll.name_en : "",
            ward: ""
        }));
    };

    const handleDeptChange = (deptId: string) => {
        setFormData(prev => {
            const current = prev.departmentIds;
            if (current.includes(deptId)) {
                return { ...prev, departmentIds: current.filter(d => d !== deptId) };
            } else {
                return { ...prev, departmentIds: [...current, deptId] };
            }
        });
    };

    // -- Vision Scan Handler --
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setScanError(null);
        setLoadingScan(true);

        const fileInput = document.getElementById("id-scan-input") as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
            setScanError("Please select a file first.");
            setLoadingScan(false);
            return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append("image", file);

        try {
            const res = await fetch("/api/ai/vision/voter-id", {
                method: "POST",
                body: formDataPayload,
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Auto-fill logic
            // Note: Matching Province/District from AI text to our IDs is hard completely client-side without fuzzy matching.
            // For now, we will blindly fill the textual fields if they happen to match, or just fill the raw extraction.
            // Ideally, we'd have a helper to map "Koshi" -> "p1", etc. 
            // HERE: We only fill the text values (fullName, details) and maybe leave location for user to select 
            // unless we want to try to match text. Simplicity: Fill Name/DOB/ID Numbers.

            setFormData(prev => ({
                ...prev,
                extracted: data,

                // Auto-fill logic (with overrides if user hasn't typed?)
                // We overwrite for now as this is an explicit "Scan" action by user.
                fullNameNe: data.full_name || prev.fullNameNe,
                dobOriginal: data.date_of_birth || prev.dobOriginal,
                citizenshipNumber: data.citizenship_number || data.voter_id_number || prev.citizenshipNumber,

                // Address (Best effort text fill)
                provinceNe: data.province || prev.provinceNe,
                districtNe: data.district || prev.districtNe,
                localLevelNe: data.municipality || prev.localLevelNe,
                ward: data.ward || prev.ward,
                toleNe: data.address_full || prev.toleNe,

                // Gender & Identity
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                genderCode: (data.gender_code as any) || prev.genderCode,
                genderRaw: data.gender_raw || prev.genderRaw,
                inclusionRaw: (data.inclusion_clues && data.inclusion_clues.length > 0) ? data.inclusion_clues.join(", ") : prev.inclusionRaw,
                idImageUrl: "https://placehold.co/600x400?text=ID+Card+Scanned"
            }));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error parsing ID:", error);
            setScanError(error.message || "Failed to scan ID");
        } finally {
            setLoadingScan(false);
        }
    };


    // -- Photo Upload & Crop Handlers --

    // 1. Select File -> Open Cropper
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setTempImgSrc(reader.result?.toString() || null);
                setIsCropping(true);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            });
            reader.readAsDataURL(file);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // 2. Upload Cropped Image
    const handleUploadCropped = async () => {
        if (!tempImgSrc || !croppedAreaPixels) return;

        setUploadingPhoto(true);
        try {
            const croppedBlob = await getCroppedImg(tempImgSrc, croppedAreaPixels);
            if (!croppedBlob) throw new Error("Cropping failed");

            // Convert blob to file for standard upload API
            const file = new File([croppedBlob], "profile_cropped.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("image", file);
            if (memberId) {
                formData.append("memberId", memberId);
            }

            const res = await fetch("/api/upload/profile-photo", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            setFormData(prev => ({
                ...prev,
                profileImageUrl: data.imageUrl
            }));

            // Close cropper
            setIsCropping(false);
            setTempImgSrc(null);

        } catch (err) {
            alert("Photo upload failed: " + (err instanceof Error ? err.message : "uknown error"));
        } finally {
            setUploadingPhoto(false);
        }
    };

    // -- Final Submission --
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        // Validation
        if (!formData.fullNameNe) { setSubmitError("Full Name is required"); return; }
        if (!formData.phone) { setSubmitError("Phone is required"); return; }
        if (!formData.email) { setSubmitError("Email is required"); return; }
        if (!formData.provinceNe || !formData.districtNe || !formData.localLevelNe) {
            setSubmitError("Please complete the address details (Province/District/Level).");
            return;
        }

        setSubmitting(true);

        try {
            // Construct Payload
            // "Address of Residence" -> toleNe. 
            // We can combine Ward + Tole into addressNe for the DB schema `address_ne`.


            const payload = {
                id: memberId, // Pass the pre-generated ID
                personal: {
                    // capacity removed from UI, handled                personal: {
                    fullNameNe: formData.fullNameNe,
                    fullNameEn: formData.fullNameEn || null,
                    // Legacy gender (map for safety)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    gender: (["male", "female", "lgbtqi_plus", "prefer_not_to_say", "other"].includes(formData.genderCode) ? formData.genderCode : "other") as any,

                    // New fields
                    genderCode: formData.genderCode,
                    genderLabelNe: GENDER_OPTIONS.find(g => g.code === formData.genderCode)?.labelNe || null,
                    genderLabelEn: GENDER_OPTIONS.find(g => g.code === formData.genderCode)?.labelEn || null,
                    genderRaw: formData.genderRaw || null,

                    inclusionGroups: formData.inclusionGroups,
                    inclusionGroupsNe: formData.inclusionGroups.reduce((acc, code) => {
                        const opt = INCLUSION_OPTIONS.find(o => o.code === code);
                        if (opt) acc[code] = opt.labelNe;
                        return acc;
                    }, {} as Record<string, string>),
                    inclusionGroupsEn: formData.inclusionGroups.reduce((acc, code) => {
                        const opt = INCLUSION_OPTIONS.find(o => o.code === code);
                        if (opt) acc[code] = opt.labelEn;
                        return acc;
                    }, {} as Record<string, string>),
                    inclusionRaw: formData.inclusionRaw || null,

                    dobOriginal: formData.dobOriginal,
                    dobCalendar: formData.dobCalendar as "AD" | "BS" | "unknown",

                    provinceNe: formData.provinceNe || null,
                    districtNe: formData.districtNe || null,
                    localLevelNe: formData.localLevelNe || null,
                    addressNe: `${formData.localLevelNe || ''} - ${formData.ward}, ${formData.toleNe || ''}`, // Combined format


                    // Actually, the prompt said: "The selected province_id, district_id, local_level_id should be included in the membership form payload."
                    // I will stick them in `meta` or add them if the type allows.
                    // Checking `types.ts`, `personal` has string fields. 
                    // I'll add them to `meta` to be safe without breaking existing types, OR just rely on the text names which are derived from IDs.
                    // Let's put them in `meta` as well.

                    // English fields optional/unused in this form version
                    provinceEn: null,
                    districtEn: null,
                    localLevelEn: null,
                    addressEn: null,
                },
                contact: {
                    phone: formData.phone,
                    email: formData.email
                },
                party: {
                    skillsText: formData.skillsText || null,
                    pastAffiliations: formData.pastAffiliations || null,
                    motivationTextNe: formData.motivationTextNe,
                    motivationTextEn: null, // Only one motivation field in UI
                    departmentIds: formData.departmentIds,
                    inspiredBy: formData.inspiredBy || null,
                    confidentiality: formData.confidentiality
                },
                documents: {
                    idDocument: {
                        docType: "citizenship",
                        imageUrl: formData.idImageUrl || "placeholder-no-image",
                        extracted: formData.extracted,
                        aiModel: "gemini-2.5-flash"
                    },
                    profilePhoto: {
                        imageUrl: formData.profileImageUrl || ""
                    }
                },
                meta: {
                    source: "web_form_v1",
                    locale: "ne",
                    aiUsedForPrefill: Object.keys(formData.extracted).length > 0,

                    ward: formData.ward,
                    authUserId: user?.id || null,
                    // Geo IDs
                    geoProvinceId: formData.provinceId,
                    geoDistrictId: formData.districtId,
                    geoLocalLevelId: formData.localLevelId
                }
            };

            const res = await fetch("/api/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Submission failed");

            setSubmitSuccess(`Application Submitted! Member ID: ${data.id}`);
            window.scrollTo(0, 0);

        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : String(err));
        } finally {
            setSubmitting(false);
        }
    };

    // Redirect on success
    useEffect(() => {
        if (submitSuccess) {
            // Short delay to show success state if needed, or immediate. 
            // User asked for redirect.
            window.location.href = "/members";
        }
    }, [submitSuccess]);

    if (submitSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-green-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg border border-green-200">
                    <p className="text-xl font-bold text-green-700 animate-pulse">Redirecting to gallery...</p>
                </div>
            </div>
        );
    }

    // Styles
    const labelStyle = "block text-sm font-medium mb-1 text-slate-800";
    const inputStyle = "w-full border border-gray-300 p-2.5 rounded text-slate-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    const sectionTitleStyle = "text-xl font-bold text-slate-900 border-b border-gray-200 pb-2 mb-6";

    return (
        <main className="min-h-screen py-12 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-brand-blue p-8 text-white text-center">
                    <h1 className="text-3xl font-bold mb-2">सदस्यता आवेदन फारम</h1>
                    <p className="text-brand-blue text-lg mb-4">Membership Application Form</p>

                    {!user && (
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="bg-white text-blue-800 px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100 inline-flex items-center gap-2 transition-transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    )}
                    {user && (
                        <div className="mt-4 bg-blue-900/50 inline-block px-4 py-2 rounded-lg border border-blue-400/30">
                            <p className="text-sm">Signed in as: <span className="font-bold">{user.email}</span></p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-12">

                    {/* 1. Document Scan */}
                    <section>
                        <h2 className={sectionTitleStyle}>१. नागरिकता / मतदाता परिचयपत्र स्क्यान (Scan Citizenship / Voter ID)</h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 w-full">
                                <label className={labelStyle}>परिचयपत्रको फोटो (Upload ID Image)</label>
                                <input id="id-scan-input" type="file" accept="image/*" className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800" />
                            </div>
                            <button
                                type="button"
                                onClick={handleScan}
                                disabled={loadingScan}
                                className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-800 disabled:bg-gray-400 min-w-[160px] cursor-pointer"
                            >
                                {loadingScan ? "सर्च गर्दै... (Scanning...)" : "Scan & Auto-fill"}
                            </button>
                        </div>
                        {scanError && <p className="text-brand-red text-sm mt-2 font-medium bg-red-50 p-2 rounded">{scanError}</p>}
                    </section>


                    {/* 2. Personal & Contact */}
                    <section className="space-y-6">
                        <h2 className={sectionTitleStyle}>२. व्यक्तिगत विवरण (Personal Details)</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>नाम थर (Full Name) <span className="text-brand-red">*</span></label>
                                <input type="text" name="fullNameNe" value={formData.fullNameNe} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className={labelStyle}>लिङ्ग (Gender) <span className="text-brand-red">*</span></label>
                                <div className="space-y-3 mt-2">
                                    {GENDER_OPTIONS.map((opt) => (
                                        <label key={opt.code} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.genderCode === opt.code ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50 border-gray-200"}`}>
                                            <input
                                                type="radio"
                                                name="genderCode"
                                                value={opt.code}
                                                checked={formData.genderCode === opt.code}
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                onChange={(e) => setFormData(p => ({ ...p, genderCode: e.target.value as any }))}
                                                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="ml-3">
                                                <span className="block text-slate-800 font-medium">{opt.labelNe}</span>
                                                <span className="block text-slate-500 text-xs">{opt.labelEn}</span>
                                            </div>
                                        </label>
                                    ))}

                                    {/* Free text input if 'self_described' is selected */}
                                    {formData.genderCode === 'self_described' && (
                                        <input
                                            type="text"
                                            value={formData.genderRaw}
                                            onChange={(e) => setFormData(p => ({ ...p, genderRaw: e.target.value }))}
                                            className={`${inputStyle} mt-2`}
                                            placeholder="तपाईंको लैङ्गिक पहिचान लेख्नुहोस् (Self describe...)"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Inclusive Identity Section */}
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2 border-b pb-1">समावेशी पहिचान / Inclusive Identity <span className="text-xs font-normal text-slate-500 ml-2">(Optional but Encouraged)</span></h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {INCLUSION_OPTIONS.map((opt) => (
                                    <label key={opt.code} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${formData.inclusionGroups.includes(opt.code) ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50 border-gray-200"}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.inclusionGroups.includes(opt.code)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData(prev => {
                                                    const current = prev.inclusionGroups;
                                                    if (checked) {
                                                        return { ...prev, inclusionGroups: [...current, opt.code] };
                                                    } else {
                                                        return { ...prev, inclusionGroups: current.filter(c => c !== opt.code) };
                                                    }
                                                });
                                            }}
                                            className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="block text-slate-800 text-sm font-medium">{opt.labelNe}</span>
                                            <span className="block text-slate-500 text-xs">{opt.labelEn}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {formData.inclusionGroups.includes('other_specified') && (
                                <div className="mt-3">
                                    <label className={labelStyle}>अन्य विवरण (Specify Other Identity)</label>
                                    <input
                                        type="text"
                                        value={formData.inclusionRaw}
                                        onChange={(e) => setFormData(p => ({ ...p, inclusionRaw: e.target.value }))}
                                        className={inputStyle}
                                        placeholder=".."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className={labelStyle}>जन्म मिति (Date of Birth)</label>
                                    <input type="text" name="dobOriginal" value={formData.dobOriginal} onChange={handleChange} placeholder="YYYY-MM-DD" className={inputStyle} />
                                </div>
                                <div className="w-28">
                                    <label className={labelStyle}>Type</label>
                                    <select name="dobCalendar" value={formData.dobCalendar} onChange={handleChange} className={inputStyle}>
                                        <option value="BS">BS</option>
                                        <option value="AD">AD</option>
                                        <option value="Unknown">Unknown</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>नागरिकता नम्बर (Citizenship Number)</label>
                                {/* Note: we didn't add this to payload before but user asked for it in labels. 
                                    I will ensure it's in extracted or meta if not in schema.
                                    Schema HAS citizenship_number. I need to ensure it gets sent.
                                    In page 1: it was auto-extracted. 
                                    Here: Use extracted if available, or just skip manual input for now unless I add a specific state field for it.
                                    The prompt says "Use exact labels".
                                    I'll just add a UI input for it, but if schema in `types.ts` expects it, I should map it.
                                    Wait, `MembershipRequestPayload` doesn't have explicit citizenshipNumber field in `personal` block in my previous definition.
                                    It relied on `documents.idDocument.extracted`.
                                    I won't break backend as requested. I'll just show the input and maybe store it in `extracted` state.
                                */}
                                <input
                                    type="text"
                                    value={formData.extracted?.citizenshipNumberRaw || ""}
                                    onChange={(e) => setFormData(p => ({ ...p, extracted: { ...p.extracted, citizenshipNumberRaw: e.target.value } }))}
                                    className={inputStyle}
                                    placeholder="Scanned or Enter Manual"
                                />
                            </div>
                        </div>

                        {/* Location Dropdowns */}
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mt-4 space-y-4">
                            <label className="block text-sm font-semibold text-blue-900 border-b border-blue-100 pb-1 mb-3">ठेगाना (Address)</label>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Province (प्रदेश) <span className="text-red-500">*</span></label>
                                    <select value={formData.provinceId} onChange={handleProvinceChange} className={inputStyle} disabled={loadingGeo}>
                                        <option value="">{loadingGeo ? "Loading..." : "छान्नुहोस् (Select)"}</option>
                                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name_en}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>District (जिल्ला) <span className="text-red-500">*</span></label>
                                    <select value={formData.districtId} onChange={handleDistrictChange} className={inputStyle} disabled={!formData.provinceId}>
                                        <option value="">छान्नुहोस् (Select)</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name_en}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Local Level (पालिका/वडा) <span className="text-red-500">*</span></label>
                                    <select
                                        name="localLevelId"
                                        value={formData.localLevelId}
                                        onChange={handleLocalLevelChange}
                                        className={inputStyle}
                                        disabled={!formData.districtId}
                                    >
                                        <option value="">छान्नुहोस् (Select)</option>
                                        {localLevels.map(l => <option key={l.id} value={l.id}>{l.name_en} ({l.category_label || 'Municipality'})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>वडा नं. (Ward No.)</label>
                                    <select
                                        name="ward"
                                        value={formData.ward}
                                        onChange={handleChange}
                                        className={inputStyle}
                                        disabled={!formData.localLevelId || wardOptions.length === 0}
                                    >
                                        <option value="">-</option>
                                        {wardOptions.map(w => <option key={w} value={w}>{w}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>बसाईको ठेगाना (Address of Residence)</label>
                                <input type="text" name="toleNe" value={formData.toleNe} onChange={handleChange} className={inputStyle} placeholder="गल्ली / टोल (Street / Tole)" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div>
                                <label className={labelStyle}>सम्पर्क नम्बर (Contact Number) <span className="text-brand-red">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className={labelStyle}>ईमेल (Email Address) <span className="text-brand-red">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
                            </div>
                        </div>
                    </section>

                    {/* 3. Party Details */}
                    <section className="space-y-6">
                        <h2 className={sectionTitleStyle}>३. पार्टी विवरण (Party Details)</h2>

                        <div>
                            <label className={labelStyle}>को बाट प्रभावित भएर संगठनमा जोडिनु भएको छ? (Who or what inspired you to join?)</label>
                            <input type="text" name="inspiredBy" value={formData.inspiredBy} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>आफूले छानेको विभाग अथवा काम गरेको क्षेत्रको विषयमा आफ्नो रुचि, अनुभव वा योग्यता को बारेमा केही लेखिदिनुहुन अनुरोध गरिन्छ । (Motivation / Experience / Qualification) <span className="text-brand-red">*</span></label>
                            <textarea name="motivationTextNe" value={formData.motivationTextNe} onChange={handleChange} rows={4} className={inputStyle} required />
                        </div>

                        <div>
                            <label className={labelStyle}>तपाईँले पार्टीलाई योगदान गर्न चाहेको सीप (Any special skills you want to contribute in the party.)</label>
                            <textarea name="skillsText" value={formData.skillsText} onChange={handleChange} rows={2} className={inputStyle} />
                        </div>

                        <div>
                            <label className={labelStyle}>पुरानो आबद्धता, पद (Past Affiliations)</label>
                            <textarea name="pastAffiliations" value={formData.pastAffiliations} onChange={handleChange} rows={2} className={inputStyle} />
                        </div>

                        <div className="mt-4">
                            <label className={labelStyle}>काम गर्न चाहेको क्षेत्र (Preferred Department/Area of Work)</label>
                            <div className="grid md:grid-cols-2 gap-3 mt-2">
                                {DEPARTMENTS.map(dept => (
                                    <label key={dept.id} className={`flex items-center space-x-3 border p-3.5 rounded-lg cursor-pointer transition-colors ${formData.departmentIds.includes(dept.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50 border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.departmentIds.includes(dept.id)}
                                            onChange={() => handleDeptChange(dept.id)}
                                            className="w-5 h-5 text-blue-700 rounded focus:ring-brand-blue"
                                        />
                                        <span className="text-sm font-medium text-slate-800">{dept.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <label className={labelStyle}>के तपाईँ आफूले उपलब्ध गराएका सूचना गोप्य राख्न चाहानुहुन्छ? (Do you want your provided information to be kept confidential?)</label>
                            <div className="flex gap-8 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="confidentiality" value="public_ok" checked={formData.confidentiality === 'public_ok'} onChange={handleChange} className="w-4 h-4 text-blue-700" />
                                    <span className="text-sm text-slate-900 font-medium">Public (सार्वजनिक)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="confidentiality" value="keep_private" checked={formData.confidentiality === 'keep_private'} onChange={handleChange} className="w-4 h-4 text-blue-700" />
                                    <span className="text-sm text-slate-900 font-medium">Confidential (गोप्य)</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* 4. Photo Upload */}
                    <section className="space-y-4">
                        <h2 className={sectionTitleStyle}>४. फोटो (Photo)</h2>
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4">

                            {formData.profileImageUrl ? (
                                <div className="relative">
                                    <Image
                                        src={formData.profileImageUrl}
                                        alt="Profile Preview"
                                        width={128}
                                        height={128}
                                        unoptimized={formData.profileImageUrl.startsWith('blob:')}
                                        className="rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, profileImageUrl: "" }))}
                                        className="absolute -top-2 -right-2 bg-brand-red text-white rounded-full p-1 hover:bg-brand-red shadow"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.707 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoSelect}
                                    disabled={uploadingPhoto}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                                />
                                <p className="text-xs text-gray-500 mt-2">Recommended: Square format, clear face visibility.</p>
                            </div>
                        </div>

                        {/* Cropper Modal Overlay */}
                        {isCropping && tempImgSrc && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[500px]">
                                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-800">Adjust Photo</h3>
                                        <button onClick={() => setIsCropping(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                                    </div>

                                    <div className="relative flex-1 bg-black">
                                        <Cropper
                                            image={tempImgSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            showGrid={false}
                                            cropShape="round"
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                    </div>

                                    <div className="p-6 bg-white space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zoom</label>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsCropping(false)}
                                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUploadCropped}
                                                disabled={uploadingPhoto}
                                                className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-blue disabled:opacity-50"
                                            >
                                                {uploadingPhoto ? "Uploading..." : "Save & Upload"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Submit */}
                    <div className="pt-6">
                        {submitError && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 font-medium">{submitError}</div>}

                        <BrandButton
                            type="submit"
                            disabled={submitting}
                            variant="primary"
                            className="w-full text-xl py-4 shadow-lg flex items-center justify-center gap-2"
                        >
                            {submitting ? "Processing..." : "आवेदन बुझाउनुहोस् (Submit Application)"}
                        </BrandButton>
                    </div>
                </form>
            </div>
        </main >
    );
}
