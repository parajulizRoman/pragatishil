"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Save, AlertTriangle, Info } from "lucide-react";
import { updateMembership } from "./actions";
import { NestedProvince } from "@/lib/geo";

// Shared Options & Styles
const labelStyle = "block text-sm font-medium mb-1 text-slate-800";
const inputStyle = "w-full border border-gray-300 p-2.5 rounded text-slate-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";
const sectionTitleStyle = "text-xl font-bold text-slate-900 border-b border-gray-200 pb-2 mb-6";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MembershipForm({ member }: { member: any }) {
    const [loading, setLoading] = useState(false);

    // -- GEO STATE --
    const [geoStructure, setGeoStructure] = useState<NestedProvince[]>([]);
    const [loadingGeo, setLoadingGeo] = useState(true);

    // Initial Values (From DB or Meta)
    const [provinceId, setProvinceId] = useState(member.meta?.geoProvinceId || "");
    const [districtId, setDistrictId] = useState(member.meta?.geoDistrictId || "");
    const [localLevelId, setLocalLevelId] = useState(member.meta?.geoLocalLevelId || "");

    // -- FORM STATE (For controlled complex fields) --
    const [genderCode, setGenderCode] = useState(member.gender_code || member.gender || "male");
    const [genderRaw, setGenderRaw] = useState(member.gender_raw || "");
    const [inclusionGroups, setInclusionGroups] = useState<string[]>(member.inclusion_groups || []);
    const [inclusionRaw, setInclusionRaw] = useState(member.inclusion_raw || "");

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

    // Geo Derived Logic
    const districts = useMemo(() => {
        const prov = geoStructure.find(p => String(p.id) === String(provinceId));
        return prov ? prov.districts : [];
    }, [provinceId, geoStructure]);

    const localLevels = useMemo(() => {
        const dist = districts.find(d => String(d.id) === String(districtId));
        return dist ? dist.localLevels : [];
    }, [districtId, districts]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Append controlled state manually if needed (Standard form submission usually catches named inputs, but arrays/logic need care)
        // Gender Code is named input, so ok.
        // Inclusion Groups: We need to append them as comma joined string for the Action to parse
        formData.set("inclusionGroups", inclusionGroups.join(","));
        formData.set("provinceId", provinceId);
        formData.set("districtId", districtId);
        formData.set("localLevelId", localLevelId);

        // Names for Geo are important too
        const prov = geoStructure.find(p => String(p.id) === String(provinceId));
        const dist = districts.find(d => String(d.id) === String(districtId));
        const ll = localLevels.find(l => String(l.id) === String(localLevelId));

        if (prov) formData.set("provinceNe", prov.name_en); // Schema uses name_en for _ne currently? Yes, mapping issue in old code, keeping consistent.
        if (dist) formData.set("districtNe", dist.name_en);
        if (ll) formData.set("localLevelNe", ll.name_en);

        try {
            await updateMembership(formData);
            alert("Membership details updated successfully!");
        } catch (error) {
            console.error(error);
            alert(`Failed to update membership: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-12 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">

            {/* Header */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 text-blue-900 mb-8">
                <Info className="shrink-0 text-blue-600" size={24} />
                <div>
                    <h3 className="font-bold text-lg">Edit Membership Record</h3>
                    <p className="text-sm text-blue-800">
                        Update your full profile details here. All changes are logged.
                        <br />
                        <strong>Note:</strong> Sensitive fields (Citizenship, DOB) are locked.
                    </p>
                </div>
            </div>

            {/* 1. Identity (Read Only) */}
            <section>
                <h2 className={sectionTitleStyle}>१. पहिचान विवरण (Identity Details)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>सदस्य नं (Member ID)</label>
                        <input value={member.id} readOnly disabled className={`${inputStyle} font-mono`} />
                    </div>
                    <div>
                        <label className={labelStyle}>नागरिकता नम्बर (Citizenship Number)</label>
                        <div className="relative">
                            <input value={member.citizenship_number || "PENDING"} readOnly disabled className={`${inputStyle} font-mono bg-amber-50/50`} />
                            <AlertTriangle className="absolute right-3 top-2.5 text-amber-500 w-5 h-5 opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Personal Details */}
            <section className="space-y-6">
                <h2 className={sectionTitleStyle}>२. व्यक्तिगत विवरण (Personal Details)</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>नाम थर (Full Name - Nepali) <span className="text-brand-red">*</span></label>
                        <input type="text" name="full_name_ne" defaultValue={member.full_name_ne} className={inputStyle} required />
                    </div>
                    <div>
                        <label className={labelStyle}>Full Name (English) <span className="text-brand-red">*</span></label>
                        <input type="text" name="full_name_en" defaultValue={member.full_name_en} className={inputStyle} required />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>बावुको नाम (Father's Name)</label>
                        <input
                            type="text"
                            name="father_name"
                            defaultValue={member.father_name || ""}
                            className={inputStyle}
                            placeholder="Optional"
                        />
                    </div>
                    <div>
                        <label className={labelStyle}>आमाको नाम (Mother's Name)</label>
                        <input
                            type="text"
                            name="mother_name"
                            defaultValue={member.mother_name || ""}
                            className={inputStyle}
                            placeholder="Optional"
                        />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>बाजेको नाम (Grandfather's Name)</label>
                        <input
                            type="text"
                            name="grandfather_name"
                            defaultValue={member.grandfather_name || ""}
                            className={inputStyle}
                            placeholder="Optional"
                        />
                    </div>
                    <div>
                        <label className={labelStyle}>पति/पत्नीको नाम (Spouse Name)</label>
                        <input
                            type="text"
                            name="spouse_name"
                            defaultValue={member.spouse_name || ""}
                            className={inputStyle}
                            placeholder="Optional"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className={labelStyle}>जन्म मिति (Date of Birth)</label>
                            <input
                                type="text"
                                value={member.dob_original || member.date_of_birth || ""}
                                readOnly
                                disabled
                                className={inputStyle}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className={labelStyle}>लिङ्ग (Gender) <span className="text-brand-red">*</span></label>
                        <div className="grid md:grid-cols-1 gap-3">
                            {GENDER_OPTIONS.map((opt) => (
                                <label key={opt.code} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${genderCode === opt.code ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50 border-gray-200"}`}>
                                    <input
                                        type="radio"
                                        name="genderCode"
                                        value={opt.code}
                                        checked={genderCode === opt.code}
                                        onChange={(e) => setGenderCode(e.target.value)}
                                        className="w-4 h-4 text-brand-blue ring-offset-2 focus:ring-2"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-slate-800 font-medium text-sm">{opt.labelNe}</span>
                                        <span className="block text-slate-500 text-xs">{opt.labelEn}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {genderCode === 'self_described' && (
                            <input
                                type="text"
                                name="genderRaw"
                                value={genderRaw}
                                onChange={(e) => setGenderRaw(e.target.value)}
                                className={inputStyle}
                                placeholder="Please describe..."
                            />
                        )}
                    </div>
                </div>

                {/* Inclusion */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-2 border-b pb-1 pt-4">समावेशी पहिचान (Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {INCLUSION_OPTIONS.map(opt => (
                            <label key={opt.code} className={`flex items-start p-3 border rounded-lg cursor-pointer ${inclusionGroups.includes(opt.code) ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50 border-gray-200"}`}>
                                <input
                                    type="checkbox"
                                    checked={inclusionGroups.includes(opt.code)}
                                    onChange={(e) => {
                                        if (e.target.checked) setInclusionGroups([...inclusionGroups, opt.code]);
                                        else setInclusionGroups(inclusionGroups.filter(c => c !== opt.code));
                                    }}
                                    className="w-4 h-4 mt-1"
                                />
                                <div className="ml-2">
                                    <span className="block text-sm font-medium text-slate-900">{opt.labelNe}</span>
                                    <span className="block text-xs text-slate-500">{opt.labelEn}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {inclusionGroups.includes('other_specified') && (
                        <div className="mt-2">
                            <input name="inclusionRaw" value={inclusionRaw} onChange={e => setInclusionRaw(e.target.value)} className={inputStyle} placeholder="Specify..." />
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Address */}
            <section className="space-y-6">
                <h2 className={sectionTitleStyle}>३. ठेगाना (Address Details)</h2>
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mt-4 space-y-4">
                    <label className="block text-sm font-semibold text-blue-900 border-b border-blue-100 pb-1 mb-3">स्थायी ठेगाना (Permanent Address)</label>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Province (प्रदेश)</label>
                            <select value={provinceId} onChange={(e) => { setProvinceId(e.target.value); setDistrictId(""); }} className={inputStyle}>
                                <option value="">Select...</option>
                                {geoStructure.map(p => <option key={p.id} value={p.id}>{p.name_en}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>District (जिल्ला)</label>
                            <select value={districtId} onChange={(e) => { setDistrictId(e.target.value); setLocalLevelId(""); }} className={inputStyle} disabled={!provinceId}>
                                <option value="">Select...</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name_en}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Local Level (पालिका)</label>
                            <select value={localLevelId} onChange={(e) => setLocalLevelId(e.target.value)} className={inputStyle} disabled={!districtId}>
                                <option value="">Select...</option>
                                {localLevels.map(l => <option key={l.id} value={l.id}>{l.name_en}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Ward No (वडा नं)</label>
                            <input name="ward" defaultValue={member.meta?.ward || ""} type="number" className={inputStyle} placeholder="#" />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Tole / Street Address</label>
                        {/* We parse Tole from address_ne if possible, or just default to blank/existing */}
                        <input name="toleNe" defaultValue={member.address_ne?.split(',')[0] || ""} className={inputStyle} />
                    </div>
                </div>
            </section>

            {/* 4. Contact */}
            <section className="space-y-6">
                <h2 className={sectionTitleStyle}>४. सम्पर्क विवरण (Contact Details)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyle}>मोबाइल नम्बर (Mobile)</label>
                        <input type="tel" name="phone" defaultValue={member.phone} className={inputStyle} />
                    </div>
                    <div>
                        <label className={labelStyle}>इमेल (Email)</label>
                        <input type="email" name="email" defaultValue={member.email} className={inputStyle} />
                    </div>
                </div>
            </section>

            {/* 5. Party Details */}
            <section className="space-y-6">
                <h2 className={sectionTitleStyle}>५. पार्टी विवरण (Party Details)</h2>
                <div>
                    <label className={labelStyle}>तपाईं पार्टीमा किन जोडिन चाहनुहुन्छ? (Motivation)</label>
                    <textarea
                        name="motivationTextNe"
                        defaultValue={member.motivation_text_ne}
                        rows={4}
                        className={inputStyle}
                        placeholder="Please describe your motivation..."
                    />
                </div>
                <div>
                    <label className={labelStyle}>तपाईंमा भएका सीपहरु (Skills / Expertise)</label>
                    <textarea
                        name="skillsText"
                        defaultValue={member.skills_text}
                        rows={3}
                        className={inputStyle}
                        placeholder="Programming, Management, Public Speaking..."
                    />
                </div>
                <div>
                    <label className={labelStyle}>विगतका आवद्धता (Past Affiliations)</label>
                    <input
                        name="pastAffiliations"
                        defaultValue={member.past_affiliations}
                        className={inputStyle}
                        placeholder="Former parties or organizations..."
                    />
                </div>
            </section>

            {/* Action Bar */}
            <div className="flex justify-end pt-8 border-t border-slate-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Details
                </button>
            </div>

        </form>
    );
}
