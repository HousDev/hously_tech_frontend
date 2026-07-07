import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import careerService, { type Job, type ApplicationFormData } from "../../../../../../services/career.service";
import { settingsApi } from "../../../../../../lib/settingsApi";
import { masterDataAPI } from "../../../../../../lib/masterApi";
import defaultLogo from "../../../../../../assets/images/hously-logo.png";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Building,
  GraduationCap,
  Printer,
  Download,
} from "lucide-react";

const SPECIALIZATION_MAP: Record<string, string[]> = {
  'B.TECH': ['CSE', 'IT', 'AI & ML', 'DS', 'Cyber Security', 'ECE', 'EE', 'ME', 'CE', 'other'],
  'M.Tech': ['CSE', 'AI', 'ML', 'DS', 'Cyber Security', 'SE', 'Power Systems', 'Structural', 'other'],
  'Diploma': ['CE', 'ME', 'EE', 'ECE', 'IT', 'Auto', 'Civil', 'other'],
  'B.COM': ['Accounting', 'Finance', 'Banking', 'Taxation', 'Marketing', 'HR', 'Economics', 'IB', 'other'],
  'MBA': ['Marketing', 'Finance', 'HR', 'Operations', 'Business Analytics', 'IT', 'IB', 'SCM', 'Digital Marketing', 'other'],
  'BSC': ['CS', 'IT', 'DS', 'AI', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Biotechnology', 'Microbiology', 'Agriculture', 'Nursing', 'other'],
  'DCA': ['Computer Apps', 'Web Design', 'Programming', 'DBMS', 'Networking', 'Tally', 'MS Office', 'other'],
  'BBA': ['Marketing', 'Finance', 'HR', 'Business Analytics', 'Digital Marketing', 'Sales', 'Retail', 'IB', 'SCM', 'Entrepreneurship', 'other'],
  'CA': ['Audit', 'Taxation', 'GST', 'Finance', 'Risk', 'Forensic', 'Consulting', 'Investment Banking', 'other'],
  'OTHER': ['other']
};

export default function JobApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job Details State
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);

  // System Settings State (For Logo & Site Name)
  const [logos, setLogos] = useState<{ navbarLogo: string; footerLogo: string; favicon: string } | null>(null);
  const [generalSettings, setGeneralSettings] = useState<{ siteTitle: string } | null>(null);

  // Random 4-digit Application ID for Docket
  const [randomAppId] = useState(() => Math.floor(1000 + Math.random() * 9000));

  // Multi-step Flow State (7 Steps)
  const TOTAL_STEPS = 7;
  const STEP_LABELS = [
    "Personal Info",
    "Candidate Type",
    "Education",
    "Skills",
    "Availability",
    "Documents",
    "Review & Submit"
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState("");

  const getBranchSelectVal = (branchVal: string) => {
    if (!branchVal) return "";
    const norm = branchVal.toUpperCase();
    if (['B.TECH', 'M.TECH', 'DIPLOMA', 'B.COM', 'MBA', 'BSC', 'DCA', 'BBA', 'CA'].includes(norm)) {
      return norm;
    }
    return "OTHER";
  };

  const getSpecSelectVal = (branchVal: string, specVal: string) => {
    if (!specVal) return "";
    const branchSelect = getBranchSelectVal(branchVal);
    if (branchSelect === "OTHER" || !branchSelect) {
      return "other";
    }
    const specs = SPECIALIZATION_MAP[branchSelect] || [];
    const found = specs.find(s => s.toLowerCase() === specVal.toLowerCase());
    return found ? found : "other";
  };

  // --- Step 1: Personal Info ---
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    gender: "",
    selfGender: "",
    dob: "",
    country: "",
    state: "",
    currentCity: "",
    currentAddress: "",
    linkedin: "",
    portfolio: "",
  });

  // Location dropdown data states
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);

  // Max DOB allowed (18 years ago from today)
  const maxDob = (() => {
    const today = new Date();
    const year = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  const [sameAsMobile, setSameAsMobile] = useState(false);

  // Sync WhatsApp when Mobile changes if sameAsMobile is checked
  useEffect(() => {
    if (sameAsMobile) {
      setPersonalInfo(prev => ({
        ...prev,
        whatsapp: prev.mobile
      }));
    }
  }, [personalInfo.mobile, sameAsMobile]);

  const handleSameAsMobileChange = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      setPersonalInfo(prev => ({
        ...prev,
        whatsapp: prev.mobile
      }));
    } else {
      setPersonalInfo(prev => ({
        ...prev,
        whatsapp: ""
      }));
    }
  };

  // --- Step 2: Candidate Type ---
  const [candidateType, setCandidateType] = useState({
    candType: "",
    fresherStudying: "",
    currentCompany: "",
    designation: "",
    employmentStatus: "",
    industry: "",
    totalExperience: "",
    relevantExperience: "",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "",
    prevCompanies: [] as Array<{
      companyName: string;
      designation: string;
      empType: string;
      startDate: string;
      endDate: string;
      currWork: boolean;
      responsibilities: string;
      achievements: string;
      reasonLeaving: string;
    }>,
    college: "",
    university: "",
    degree: "",
    branch: "",
    semester: "",
    expectedGradYear: "",
    duration: "",
    availableFrom: "",
    stipendPref: "",
    yearsFreelancing: "",
    servicesOffered: "",
    portfolioUrl: "",
    topClients: "",
    careerBreakPrevCompany: "",
    careerBreakPrevDesignation: "",
    careerBreakTotalExp: "",
    careerBreakDuration: "",
    careerBreakReason: "",
    careerBreakAvailableFrom: "",
  });

  // --- Step 3: Education ---
  const [educationList, setEducationList] = useState<Array<{
    eduLevel: string;
    institute: string;
    branch: string;
    specialization: string;
    currStudy: boolean;
    passoutYear: string;
    semester: string;
    expGrad: string;
  }>>([
    {
      eduLevel: "",
      institute: "",
      branch: "",
      specialization: "",
      currStudy: false,
      passoutYear: "",
      semester: "",
      expGrad: "",
    }
  ]);

  // --- Step 4: Skills ---
  const [skillsPortfolio, setSkillsPortfolio] = useState({
    primarySkills: [] as string[],
    secondarySkills: [] as string[],
    skillLevel: "",
    languages: "",
  });
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");

  // --- Step 5: Availability ---
  const [availability, setAvailability] = useState({
    employmentStatus: "",
    earliestJoiningDate: "",
    preferredWorkMode: "",
    willingToRelocate: "",
    preferredInterviewTime: "",
  });

  // --- Step 6: Documents & Statement ---
  const [resume, setResume] = useState<File | null>(null);
  const [whyConsider, setWhyConsider] = useState("");

  // Validation Errors state
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Fetch Job details, Logos & General settings
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setJobError(null);
        if (id) {
          const response = await careerService.getJobBySlug(id);
          if (response.success && response.data) {
            setJob(response.data);
            if (!response.data.is_active) {
              setJobError("This job is no longer accepting applications");
            }
          } else {
            setJobError("Job not found");
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setJobError("Unable to load job details");
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const logoData = await settingsApi.getLogos();
        setLogos(logoData);
      } catch (err) {
        console.error("Error loading logo settings:", err);
      }
      try {
        const genData = await settingsApi.getGeneral();
        setGeneralSettings(genData);
      } catch (err) {
        console.error("Error loading general settings:", err);
      }
    };

    fetchJobDetails();
    fetchSettings();
  }, [id]);

  // Load Country, State, and City from common master values using masterDataAPI
  useEffect(() => {
    const loadMasterLocations = async () => {
      try {
        const types = await masterDataAPI.getAllMasterTypes("common");

        // 1. Load Country
        const countryType = types.find(
          (t: any) => t.name.toLowerCase() === "country" || t.name.toLowerCase() === "countries"
        );
        let countriesData: string[] = [];
        if (countryType) {
          const vals = await masterDataAPI.getMasterValues(countryType.id);
          countriesData = vals
            .filter((v: any) => v.status === "Active" || v.status === "active")
            .map((v: any) => v.value);
        }
        if (countriesData.length === 0) {
          countriesData = ["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "Singapore"];
        }
        setCountriesList(countriesData);

        // 2. Load State
        const stateType = types.find(
          (t: any) => t.name.toLowerCase() === "state" || t.name.toLowerCase() === "states"
        );
        let statesData: string[] = [];
        if (stateType) {
          const vals = await masterDataAPI.getMasterValues(stateType.id);
          statesData = vals
            .filter((v: any) => v.status === "Active" || v.status === "active")
            .map((v: any) => v.value);
        }
        setStatesList(statesData);

        // 3. Load City
        const cityType = types.find(
          (t: any) => t.name.toLowerCase() === "city" || t.name.toLowerCase() === "cities"
        );
        let citiesData: string[] = [];
        if (cityType) {
          const vals = await masterDataAPI.getMasterValues(cityType.id);
          citiesData = vals
            .filter((v: any) => v.status === "Active" || v.status === "active")
            .map((v: any) => v.value);
        }
        setCitiesList(citiesData);
      } catch (err) {
        console.error("Error loading location master data:", err);
      }
    };
    loadMasterLocations();
  }, []);

  // Validation functions per step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      if (!personalInfo.firstName.trim()) {
        errors.firstName = "First name is required";
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(personalInfo.firstName)) {
        errors.firstName = "First name must contain only letters";
        isValid = false;
      }

      if (!personalInfo.lastName.trim()) {
        errors.lastName = "Last name is required";
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(personalInfo.lastName)) {
        errors.lastName = "Last name must contain only letters";
        isValid = false;
      }

      if (!personalInfo.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        errors.email = "Enter a valid email address";
        isValid = false;
      }

      if (!personalInfo.mobile.trim()) {
        errors.mobile = "Mobile number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(personalInfo.mobile)) {
        errors.mobile = "Mobile number must be exactly 10 digits";
        isValid = false;
      }

      if (personalInfo.whatsapp && !/^\d{10}$/.test(personalInfo.whatsapp)) {
        errors.whatsapp = "WhatsApp number must be exactly 10 digits";
        isValid = false;
      }

      if (!personalInfo.gender) {
        errors.gender = "Please select gender";
        isValid = false;
      }
      if (personalInfo.gender === "self" && !personalInfo.selfGender.trim()) {
        errors.selfGender = "Please enter description";
        isValid = false;
      }

      if (!personalInfo.dob) {
        errors.dob = "Date of Birth is required";
        isValid = false;
      } else {
        const birthDate = new Date(personalInfo.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          errors.dob = "You must be 18 years or older";
          isValid = false;
        }
      }

      if (!personalInfo.country) { errors.country = "Country is required"; isValid = false; }
      if (!personalInfo.state) { errors.state = "State is required"; isValid = false; }
      if (!personalInfo.currentCity) { errors.currentCity = "City is required"; isValid = false; }

      if (!personalInfo.linkedin.trim()) {
        errors.linkedin = "LinkedIn Profile Link is required";
        isValid = false;
      } else if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(personalInfo.linkedin)) {
        errors.linkedin = "Enter a valid LinkedIn profile URL";
        isValid = false;
      }
    }

    if (step === 2) {
      if (!candidateType.candType) {
        errors.candType = "Please select a candidate type";
        isValid = false;
      } else {
        const type = candidateType.candType;
        if (type === "experienced") {
          if (!candidateType.currentCompany.trim()) { errors.currentCompany = "Current company is required"; isValid = false; }
          if (!candidateType.designation.trim()) { errors.designation = "Designation is required"; isValid = false; }
          if (!candidateType.employmentStatus) { errors.employmentStatus = "Employment status is required"; isValid = false; }
          if (!candidateType.totalExperience) { errors.totalExperience = "Total experience is required"; isValid = false; }
          if (!candidateType.relevantExperience) { errors.relevantExperience = "Relevant experience is required"; isValid = false; }
          if (!candidateType.expectedCtc.trim()) { errors.expectedCtc = "Expected CTC is required"; isValid = false; }
          if (!candidateType.noticePeriod) { errors.noticePeriod = "Notice period is required"; isValid = false; }
        } else if (type === "internship") {
          if (!candidateType.college.trim()) { errors.college = "College name is required"; isValid = false; }
          if (!candidateType.degree.trim()) { errors.degree = "Degree is required"; isValid = false; }
          if (!candidateType.semester.trim()) { errors.semester = "Semester is required"; isValid = false; }
          if (!candidateType.expectedGradYear.trim()) { errors.expectedGradYear = "Expected graduation year is required"; isValid = false; }
          if (!candidateType.duration) { errors.duration = "Duration is required"; isValid = false; }
          if (!candidateType.availableFrom) { errors.availableFrom = "Availability date is required"; isValid = false; }
          if (!candidateType.stipendPref) { errors.stipendPref = "Please select stipend preference"; isValid = false; }
        }
      }
    }

    if (step === 3) {
      educationList.forEach((edu, idx) => {
        if (!edu.eduLevel) { errors[`edu_${idx}_level`] = "Required"; isValid = false; }
        if (!edu.institute.trim()) { errors[`edu_${idx}_inst`] = "Required"; isValid = false; }
        if (!edu.currStudy && !edu.passoutYear.trim()) { errors[`edu_${idx}_year`] = "Required"; isValid = false; }
        if (edu.currStudy) {
          if (!edu.semester.trim()) { errors[`edu_${idx}_sem`] = "Required"; isValid = false; }
          if (!edu.expGrad.trim()) { errors[`edu_${idx}_expGrad`] = "Required"; isValid = false; }
        }
      });
    }

    if (step === 4) {
      if (skillsPortfolio.primarySkills.length === 0) {
        errors.primarySkills = "Please add at least one primary skill";
        isValid = false;
      }
      if (!skillsPortfolio.skillLevel) {
        errors.skillLevel = "Please select skill level";
        isValid = false;
      }
    }

    if (step === 5) {
      if (!availability.employmentStatus) { errors.employmentStatus = "Required"; isValid = false; }
      if (!availability.earliestJoiningDate) { errors.earliestJoiningDate = "Required"; isValid = false; }
      if (!availability.preferredWorkMode) { errors.preferredWorkMode = "Required"; isValid = false; }
      if (!availability.willingToRelocate) { errors.willingToRelocate = "Required"; isValid = false; }
    }

    if (step === 6) {
      if (!resume) {
        errors.resume = "Resume / CV is required";
        isValid = false;
      }
      if (!whyConsider.trim()) {
        errors.whyConsider = "Please tell us why we should consider you";
        isValid = false;
      }
    }

    setStepErrors(errors);
    return isValid;
  };

  const handleNextStep = (step: number) => {
    if (validateStep(step)) {
      setCurrentStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = (step: number) => {
    setCurrentStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add primary skill
  const addPrimarySkill = () => {
    if (primarySkillInput.trim()) {
      if (!skillsPortfolio.primarySkills.includes(primarySkillInput.trim())) {
        setSkillsPortfolio(prev => ({
          ...prev,
          primarySkills: [...prev.primarySkills, primarySkillInput.trim()]
        }));
      }
      setPrimarySkillInput("");
    }
  };

  const removePrimarySkill = (index: number) => {
    setSkillsPortfolio(prev => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((_, i) => i !== index)
    }));
  };

  const addSecondarySkill = () => {
    if (secondarySkillInput.trim()) {
      if (!skillsPortfolio.secondarySkills.includes(secondarySkillInput.trim())) {
        setSkillsPortfolio(prev => ({
          ...prev,
          secondarySkills: [...prev.secondarySkills, secondarySkillInput.trim()]
        }));
      }
      setSecondarySkillInput("");
    }
  };

  // Previous Companies (Experienced) Helpers
  const addPrevCompany = () => {
    setCandidateType(prev => ({
      ...prev,
      prevCompanies: [...prev.prevCompanies, {
        companyName: "",
        designation: "",
        empType: "",
        startDate: "",
        endDate: "",
        currWork: false,
        responsibilities: "",
        achievements: "",
        reasonLeaving: "",
      }]
    }));
  };

  const removePrevCompany = (index: number) => {
    setCandidateType(prev => ({
      ...prev,
      prevCompanies: prev.prevCompanies.filter((_, i) => i !== index)
    }));
  };

  const handlePrevCompanyChange = (index: number, field: string, val: any) => {
    setCandidateType(prev => {
      const updated = [...prev.prevCompanies];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, prevCompanies: updated };
    });
  };

  // Education Helpers
  const addEducation = () => {
    setEducationList(prev => [...prev, {
      eduLevel: "",
      institute: "",
      branch: "",
      specialization: "",
      currStudy: false,
      passoutYear: "",
      semester: "",
      expGrad: "",
    }]);
  };

  const removeEducation = (index: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
  };

  const handleEduChange = (index: number, field: string, val: any) => {
    setEducationList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // File Validation and Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setStepErrors({ resume: "Please upload a PDF, DOC, or DOCX file only." });
        return;
      }
      if (file.size > maxSize) {
        setStepErrors({ resume: "File size must be less than 5MB." });
        return;
      }

      setResume(file);
      setStepErrors({});
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Final Dossier Cover Letter compilation
  const buildCoverLetterDossier = () => {
    let doc = "";
    doc += `## APPLICATION DOSSIER\n\n`;

    doc += `### PERSONAL DETAILS\n`;
    doc += `- **Full Name:** ${personalInfo.firstName} ${personalInfo.lastName}\n`;
    doc += `- **Email:** ${personalInfo.email}\n`;
    doc += `- **Mobile:** ${personalInfo.mobile}\n`;
    doc += `- **WhatsApp:** ${personalInfo.whatsapp || 'Same'}\n`;
    doc += `- **Gender:** ${personalInfo.gender === 'self' ? personalInfo.selfGender : personalInfo.gender}\n`;
    doc += `- **Date of Birth:** ${personalInfo.dob || '—'}\n`;
    doc += `- **Location:** ${personalInfo.currentCity}, ${personalInfo.state}, ${personalInfo.country}\n`;
    doc += `- **Address:** ${personalInfo.currentAddress || '—'}\n`;
    doc += `- **LinkedIn:** ${personalInfo.linkedin || '—'}\n`;
    doc += `- **Portfolio:** ${personalInfo.portfolio || '—'}\n\n`;

    doc += `### CANDIDATE TYPE: ${candidateType.candType.toUpperCase()}\n`;
    if (candidateType.candType === 'fresher') {
      doc += `- **Currently studying?** ${candidateType.fresherStudying}\n`;
    } else if (candidateType.candType === 'experienced') {
      doc += `- **Current Company:** ${candidateType.currentCompany}\n`;
      doc += `- **Designation:** ${candidateType.designation}\n`;
      doc += `- **Employment Status:** ${candidateType.employmentStatus}\n`;
      doc += `- **Industry:** ${candidateType.industry || '—'}\n`;
      doc += `- **Total Experience:** ${candidateType.totalExperience}\n`;
      doc += `- **Relevant Experience:** ${candidateType.relevantExperience}\n`;
      doc += `- **Current CTC:** ${candidateType.currentCtc || '—'}\n`;
      doc += `- **Expected CTC:** ${candidateType.expectedCtc}\n`;
      doc += `- **Notice Period:** ${candidateType.noticePeriod}\n`;
      if (candidateType.prevCompanies.length > 0) {
        doc += `\n**Previous Companies:**\n`;
        candidateType.prevCompanies.forEach((c, idx) => {
          doc += `${idx + 1}. **${c.companyName}** as *${c.designation}* (${c.empType}) [${c.startDate} to ${c.currWork ? 'Present' : c.endDate}]\n`;
          doc += `   - Responsibilities: ${c.responsibilities || '—'}\n`;
          doc += `   - Achievements: ${c.achievements || '—'}\n`;
          doc += `   - Reason for leaving: ${c.reasonLeaving || '—'}\n`;
        });
      }
    } else if (candidateType.candType === 'internship') {
      doc += `- **College:** ${candidateType.college}\n`;
      doc += `- **University:** ${candidateType.university || '—'}\n`;
      doc += `- **Degree:** ${candidateType.degree} (${candidateType.branch || '—'})\n`;
      doc += `- **Semester:** ${candidateType.semester}\n`;
      doc += `- **Expected Graduation:** ${candidateType.expectedGradYear}\n`;
      doc += `- **Internship Duration:** ${candidateType.duration}\n`;
      doc += `- **Available From:** ${candidateType.availableFrom}\n`;
      doc += `- **Stipend Preference:** ${candidateType.stipendPref}\n`;
    }
    doc += `\n`;

    doc += `### EDUCATION\n`;
    educationList.forEach((edu, idx) => {
      doc += `${idx + 1}. **${edu.eduLevel}** at *${edu.institute}* (${edu.currStudy ? 'Currently studying' : 'Passed ' + edu.passoutYear})\n`;
      if (edu.branch || edu.specialization) doc += `   - Field: ${edu.branch || edu.specialization || '—'}\n`;
    });
    doc += `\n`;

    doc += `### SKILLS\n`;
    doc += `- **Primary Skills:** ${skillsPortfolio.primarySkills.join(', ') || '—'}\n`;
    doc += `- **Secondary Skills:** ${skillsPortfolio.secondarySkills.join(', ') || '—'}\n`;
    doc += `- **Skill Level:** ${skillsPortfolio.skillLevel}\n`;
    doc += `- **Languages:** ${skillsPortfolio.languages || '—'}\n\n`;

    doc += `### AVAILABILITY\n`;
    doc += `- **Status:** ${availability.employmentStatus}\n`;
    doc += `- **Earliest Joining Date:** ${availability.earliestJoiningDate}\n`;
    doc += `- **Preferred Work Mode:** ${availability.preferredWorkMode}\n`;
    doc += `- **Willing to Relocate:** ${availability.willingToRelocate}\n`;
    doc += `- **Preferred Interview Time:** ${availability.preferredInterviewTime || 'Flexible'}\n\n`;

    doc += `### CANDIDATE STATEMENT\n`;
    doc += `- **Why should we consider you:**\n${whyConsider}\n`;

    return doc;
  };

  // Submit flow
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const decl1 = (document.getElementById("decl1") as HTMLInputElement)?.checked;
    const decl2 = (document.getElementById("decl2") as HTMLInputElement)?.checked;
    const decl3 = (document.getElementById("decl3") as HTMLInputElement)?.checked;

    if (!decl1 || !decl2 || !decl3) {
      alert("Please accept all required declarations before submitting.");
      return;
    }

    if (!resume || !job) return;

    setIsSubmitting(true);

    try {
      const dossierText = buildCoverLetterDossier();
      const applicationPayload: ApplicationFormData = {
        job_id: job.id,
        applicant_name: `${personalInfo.firstName.trim()} ${personalInfo.lastName.trim()}`,
        email: personalInfo.email.trim(),
        phone: personalInfo.mobile.trim(),
        experience_level: candidateType.candType === 'fresher' ? 'Fresher' : (candidateType.totalExperience || 'Experienced'),

        linkedin: personalInfo.linkedin.trim() || undefined,
        portfolio: personalInfo.portfolio.trim() || undefined,
        resume: resume,
        whatsapp: personalInfo.whatsapp.trim() || undefined,
        gender: personalInfo.gender === 'self' ? personalInfo.selfGender : personalInfo.gender,
        dob: personalInfo.dob || undefined,
        current_city: personalInfo.currentCity || undefined,
        state: personalInfo.state || undefined,
        country: personalInfo.country || undefined,
        current_address: personalInfo.currentAddress || undefined,
        candidate_type: candidateType.candType,
        fresher_studying: candidateType.candType === 'fresher' ? candidateType.fresherStudying : undefined,
        current_company: candidateType.candType === 'experienced' ? candidateType.currentCompany : undefined,
        designation: candidateType.candType === 'experienced' ? candidateType.designation : undefined,
        employment_status: candidateType.candType === 'experienced' ? candidateType.employmentStatus : undefined,
        industry: candidateType.candType === 'experienced' ? candidateType.industry : undefined,
        total_experience: candidateType.candType === 'experienced' ? candidateType.totalExperience : undefined,
        relevant_experience: candidateType.candType === 'experienced' ? candidateType.relevantExperience : undefined,
        current_ctc: candidateType.candType === 'experienced' ? candidateType.currentCtc : undefined,
        expected_ctc: candidateType.candType === 'experienced' ? candidateType.expectedCtc : undefined,
        notice_period: candidateType.candType === 'experienced' ? candidateType.noticePeriod : undefined,
        prev_companies: candidateType.candType === 'experienced' ? candidateType.prevCompanies : undefined,
        college: candidateType.candType === 'internship' ? candidateType.college : undefined,
        university: candidateType.candType === 'internship' ? candidateType.university : undefined,
        degree: candidateType.candType === 'internship' ? candidateType.degree : undefined,
        branch: candidateType.candType === 'internship' ? candidateType.branch : undefined,
        semester: candidateType.candType === 'internship' ? candidateType.semester : undefined,
        expected_grad_year: candidateType.candType === 'internship' ? candidateType.expectedGradYear : undefined,
        duration: candidateType.candType === 'internship' ? candidateType.duration : undefined,
        available_from: candidateType.candType === 'internship' ? candidateType.availableFrom : undefined,
        stipend_pref: candidateType.candType === 'internship' ? candidateType.stipendPref : undefined,
        education_list: educationList,
        primary_skills: skillsPortfolio.primarySkills,
        secondary_skills: skillsPortfolio.secondarySkills,
        skill_level: skillsPortfolio.skillLevel,
        languages: skillsPortfolio.languages || undefined,
        earliest_joining_date: availability.earliestJoiningDate || undefined,
        preferred_work_mode: availability.preferredWorkMode || undefined,
        willing_to_relocate: availability.willingToRelocate || undefined,
        preferred_interview_time: availability.preferredInterviewTime || undefined,
        why_consider: whyConsider || undefined
      };

      // Run both submission request and 5-second timer in parallel
      const submitPromise = careerService.submitApplication(applicationPayload);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 5000));

      const [response] = await Promise.all([submitPromise, delayPromise]);

      if (response.success) {
        navigate("/career");
      } else {
        throw new Error(response.message || "Failed to submit application");
      }
    } catch (err: any) {
      console.error("Error submitting application:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const receiptEl = document.querySelector('.receipt-print-area') as HTMLElement;
    if (!receiptEl) return;

    const printWindow = window.open('', '_blank', 'width=960,height=800');
    if (!printWindow) return;

    const companyName = (generalSettings?.siteTitle || 'HOUSLY FINNTECH REALTY').toUpperCase();
    const logoSrc = logos?.navbarLogo || defaultLogo;

    // Clone the receipt HTML
    const receiptClone = receiptEl.cloneNode(true) as HTMLElement;

    // Remove no-print elements from clone
    receiptClone.querySelectorAll('.no-print').forEach(el => el.remove());

    // Fix image src for logo inside clone
    receiptClone.querySelectorAll('img').forEach((el: Element) => {
      const img = el as HTMLImageElement;
      if (!img.src || img.src === window.location.href) img.src = logoSrc;
    });

    // Collect all <style> tag content from the current page (includes Tailwind CSS)
    let allStyles = '';
    document.querySelectorAll('style').forEach(s => { allStyles += s.innerHTML + '\n'; });

    // Collect all external stylesheet <link> tags
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => `<link rel="stylesheet" href="${(link as HTMLLinkElement).href}">`)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${companyName} \u2013 Job Application Docket</title>
        ${linkTags}
        <style>
          ${allStyles}
          /* Force color printing & clean layout */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body {
            background: #ffffff !important;
            padding: 28px !important;
            margin: 0 !important;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          .receipt-print-area {
            max-width: 860px;
            margin: 0 auto;
            background: #fff !important;
            border-radius: 16px;
            border: 1px solid #e3e5ee !important;
            padding: 36px !important;
            box-shadow: 0 2px 16px rgba(0,0,0,0.06) !important;
            position: relative !important;
            overflow: visible !important;
          }
          @media print {
            body { padding: 0 !important; }
            @page { margin: 10mm; size: A4; }
          }
        </style>
      </head>
      <body>
        ${receiptClone.outerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Wait for external stylesheets to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 900);
  };

  // Loader screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0076d8] animate-spin mx-auto mb-3" />
          <p className="text-xs sm:text-sm text-[#5b5f70] font-medium">Loading application form...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[#e3e5ee]">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#14161f] mb-2">
            {jobError || "Job not found"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5f70] mb-5">
            The job you're trying to apply for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/career")}
            className="w-full bg-[#0076d8] hover:bg-[#005eb0] text-white py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Back to All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-form-container min-h-screen bg-[#f6f7fb] text-[#14161f] pt-24 pb-20 select-text">
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <img
            src="/lodder.png"
            alt="Loading..."
            className="w-32 h-32 object-contain animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>
      )}
      {/* Scope HTML styling */}
      <style>{`
        .application-form-container {
          --ink: #14161f;
          --ink-soft: #5b5f70;
          --line: #e3e5ee;
          --paper: #f6f7fb;
          --card: #ffffff;
          --accent: #0076d8;
          --accent-hover: #005eb0;
          --accent-soft: #eef7ff;
          --accent-line: #a1d1f7;
          --good: #0f7a52;
          --good-soft: #e8f6ef;
          --bad: #c33;
          --radius: 16px;
        }
        .application-form-container input:focus, 
        .application-form-container select:focus, 
        .application-form-container textarea:focus {
          outline: 2px solid var(--accent-line) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 4px rgba(0, 118, 216, 0.1) !important;
        }
        @media print {
          /* Hide all surrounding page elements */
          body * {
            visibility: hidden !important;
          }
          /* Show ONLY the receipt and its contents */
          .receipt-print-area, .receipt-print-area * {
            visibility: visible !important;
          }
          /* Absolutely position the receipt on the print canvas */
          .receipt-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            visibility: visible !important;
          }
          /* Force hide elements with no-print class */
          .no-print, .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          @page { margin: 10mm; size: A4; }
        }
      `}</style>

      <div className="max-w-[1140px] mx-auto px-4">
        {/* Back Link */}
        <button
          onClick={() => navigate(`/career/job/${job.slug}`)}
          className="text-xs sm:text-[13px] font-semibold text-[#5b5f70] mb-5 hover:text-[#14161f] transition-colors flex items-center gap-1.5 no-print"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job Details</span>
        </button>

        {/* Success Page */}
        {isSubmitted ? (
          <div className="bg-white border border-[#e3e5ee] rounded-2xl p-8 sm:p-12 text-center shadow-lg max-w-2xl mx-auto mt-6">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#14161f] mb-2">
              Application Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-[#5b5f70] mb-6">
              A confirmation email has been sent to your inbox.
            </p>
            <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#eef7ff] border border-[#a1d1f7] rounded-xl p-5 mb-8 w-full max-w-xl mx-auto text-left">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5b5f70]">Application ID</span>
                <b className="block text-sm sm:text-base text-[#0076d8] font-extrabold mt-0.5">{submittedAppId}</b>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5b5f70]">Job Title</span>
                <b className="block text-sm sm:text-base text-[#0076d8] font-extrabold mt-0.5">{job.job_title}</b>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5b5f70]">Candidate</span>
                <b className="block text-sm sm:text-base text-[#0076d8] font-extrabold mt-0.5">{`${personalInfo.firstName} ${personalInfo.lastName}`}</b>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate("/career/job")}
                className="px-6 py-2.5 bg-[#0076d8] text-white rounded-lg font-semibold hover:bg-[#005eb0] transition-colors text-xs sm:text-sm"
              >
                Browse Other Jobs
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-lg font-semibold text-xs sm:text-sm"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Form Stepper (Scrollable) */}
            <div className="lg:col-span-7">
              {/* Sticky Header & Stepper Tracker (below website main navbar) */}
              <div className="sticky top-[80px] z-20 bg-[#f6f7fb]/95 backdrop-blur-md pt-3 pb-3 border-b border-[#e3e5ee] mb-6 shadow-sm shadow-[#f6f7fb] no-print">
                <header className="mb-4">
                  <span className="float-right text-xs text-[#5b5f70] mt-2">
                    Ref: <b className="bg-[#eef7ff] text-[#0076d8] px-2.5 py-0.5 rounded-full text-[11px] font-bold">#{job.id}</b>
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#14161f] m-0">
                    Apply for <span className="text-[#0076d8]">{job.job_title}</span>
                  </h1>
                  <div className="text-[11px] sm:text-xs text-[#5b5f70] mt-1">
                    {job.department} • {job.job_type}
                  </div>
                </header>

                {/* Steps Progress Tracker */}
                <div className="flex overflow-x-auto gap-0 pb-1.5 scrollbar-thin">
                  {STEP_LABELS.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = currentStep === stepNum;
                    const isDone = currentStep > stepNum;
                    return (
                      <div key={label} className="flex items-center flex-shrink-0">
                        <div
                          className={`flex items-center gap-1.5 text-[11px] font-bold ${isActive ? "text-[#0076d8]" : isDone ? "text-[#0f7a52]" : "text-[#b0b3c2]"
                            }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] leading-none text-white font-extrabold ${isActive ? "bg-[#0076d8]" : isDone ? "bg-[#0f7a52]" : "bg-[#e3e5ee]"
                              }`}
                          >
                            {isDone ? "✓" : stepNum}
                          </span>
                          <span className="whitespace-nowrap">{label}</span>
                        </div>
                        {stepNum < TOTAL_STEPS && (
                          <div className="w-4 h-[1px] bg-[#e3e5ee] mx-2 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error notifications */}
              {submitError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm no-print">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Form step panels */}
              <form onSubmit={handleFinalSubmit} noValidate>
                {/* STEP 1: PERSONAL INFO */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#0076d8]" />
                        <span>Personal Information</span>
                      </h2>
                      <p className="text-xs text-[#5b5f70] mb-4">Basic details so we know who you are and how to reach you.</p>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0076d8] mb-3 flex items-center gap-2">
                        <span>Basic Details</span>
                        <div className="flex-1 h-[1px] bg-[#e3e5ee]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">First Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={personalInfo.firstName}
                            onChange={e => setPersonalInfo({ ...personalInfo, firstName: e.target.value.replace(/[^A-Za-z\s]/g, '') })}
                            placeholder="Jane"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.firstName && <span className="text-red-500 text-[10px] mt-1">{stepErrors.firstName}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Last Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            required
                            value={personalInfo.lastName}
                            onChange={e => setPersonalInfo({ ...personalInfo, lastName: e.target.value.replace(/[^A-Za-z\s]/g, '') })}
                            placeholder="Doe"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.lastName && <span className="text-red-500 text-[10px] mt-1">{stepErrors.lastName}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            required
                            value={personalInfo.email}
                            onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                            placeholder="jane@example.com"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.email && <span className="text-red-500 text-[10px] mt-1">{stepErrors.email}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            required
                            value={personalInfo.mobile}
                            onChange={e => setPersonalInfo({ ...personalInfo, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            placeholder="9876543210"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.mobile && <span className="text-red-500 text-[10px] mt-1">{stepErrors.mobile}</span>}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[12.5px] font-semibold text-[#14161f]">WhatsApp Number <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                            <label className="flex items-center gap-1 text-xs text-[#0076d8] font-bold cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={sameAsMobile}
                                onChange={e => handleSameAsMobileChange(e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-[#0076d8] focus:ring-0 cursor-pointer"
                              />
                              <span>Same as Mobile</span>
                            </label>
                          </div>
                          <input
                            type="tel"
                            disabled={sameAsMobile}
                            value={personalInfo.whatsapp}
                            onChange={e => setPersonalInfo({ ...personalInfo, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            placeholder="9876543210"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white disabled:opacity-75 disabled:bg-slate-50"
                          />
                          {stepErrors.whatsapp && <span className="text-red-500 text-[10px] mt-1">{stepErrors.whatsapp}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Gender <span className="text-red-500">*</span></label>
                          <select
                            value={personalInfo.gender}
                            onChange={e => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="nonbinary">Non-binary</option>
                            <option value="na">Prefer not to say</option>
                            <option value="self">Self-describe</option>
                          </select>
                          {stepErrors.gender && <span className="text-red-500 text-[10px] mt-1">{stepErrors.gender}</span>}
                        </div>

                        {personalInfo.gender === "self" && (
                          <div className="flex flex-col sm:col-span-2 bg-[#eef7ff] border-l-4 border-[#a1d1f7] p-3 rounded-r-lg">
                            <label className="text-xs font-semibold text-[#0076d8] mb-1">Self-described gender description</label>
                            <input
                              type="text"
                              value={personalInfo.selfGender}
                              onChange={e => setPersonalInfo({ ...personalInfo, selfGender: e.target.value.replace(/[^A-Za-z\s]/g, '') })}
                              placeholder="Enter how you identify"
                              className="px-3 py-1.5 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                            />
                            {stepErrors.selfGender && <span className="text-red-500 text-[10px] mt-1">{stepErrors.selfGender}</span>}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                          <input
                            type="date"
                            required
                            max={maxDob}
                            value={personalInfo.dob}
                            onChange={e => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.dob && <span className="text-red-500 text-[10px] mt-1">{stepErrors.dob}</span>}
                        </div>
                      </div>

                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0076d8] mt-6 mb-3 flex items-center gap-2">
                        <span>Current Location</span>
                        <div className="flex-1 h-[1px] bg-[#e3e5ee]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Country Select */}
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Country <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={personalInfo.country}
                            onChange={e => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          >
                            <option value="">Select Country</option>
                            {countriesList.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {stepErrors.country && <span className="text-red-500 text-[10px] mt-1">{stepErrors.country}</span>}
                        </div>

                        {/* State Select */}
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">State <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={personalInfo.state}
                            onChange={e => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          >
                            <option value="">Select State</option>
                            {statesList.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {stepErrors.state && <span className="text-red-500 text-[10px] mt-1">{stepErrors.state}</span>}
                        </div>

                        {/* City Select */}
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">City <span className="text-red-500">*</span></label>
                          <select
                            required
                            value={personalInfo.currentCity}
                            onChange={e => setPersonalInfo({ ...personalInfo, currentCity: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          >
                            <option value="">Select City</option>
                            {citiesList.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {stepErrors.currentCity && <span className="text-red-500 text-[10px] mt-1">{stepErrors.currentCity}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col mt-4">
                        <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Current Address <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                        <textarea
                          value={personalInfo.currentAddress}
                          onChange={e => setPersonalInfo({ ...personalInfo, currentAddress: e.target.value })}
                          placeholder="Flat / Street / Area"
                          className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white min-h-[70px] resize-y"
                        />
                      </div>

                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0076d8] mt-6 mb-3 flex items-center gap-2">
                        <span>Profiles &amp; Portfolios (Optional)</span>
                        <div className="flex-1 h-[1px] bg-[#e3e5ee]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">LinkedIn Profile Link <span className="text-red-500">*</span></label>
                          <input
                            type="url"
                            required
                            value={personalInfo.linkedin}
                            onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                          {stepErrors.linkedin && <span className="text-red-500 text-[10px] mt-1">{stepErrors.linkedin}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Portfolio Link <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                          <input
                            type="url"
                            value={personalInfo.portfolio}
                            onChange={e => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                            placeholder="https://myportfolio.com"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handleNextStep(1)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: CANDIDATE TYPE */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[#0076d8]" />
                        <span>Which best describes you?</span>
                      </h2>
                      <p className="text-xs text-[#5b5f70] mb-4">Please select your current career status.</p>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="flex flex-col mb-4">
                        <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Candidate Type <span className="text-red-500">*</span></label>
                        <select
                          value={candidateType.candType}
                          onChange={e => setCandidateType({ ...candidateType, candType: e.target.value })}
                          className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                        >
                          <option value="">Select Candidate Type</option>
                          <option value="fresher">Fresher</option>
                          <option value="internship">Internship</option>
                          <option value="experienced">Professional Experience</option>
                        </select>
                        {stepErrors.candType && <span className="text-red-500 text-[10px] mt-1">{stepErrors.candType}</span>}
                      </div>

                      {/* Conditional Flow render - Rendered seamlessly without background color/icons wrapper */}
                      {candidateType.candType === "fresher" && (
                        <div className="mt-4 space-y-3">
                          <div className="flex flex-col">
                            <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Currently studying? <span className="text-xs font-normal text-[#5b5f70]">(you'll add full education details next step)</span></label>
                            <div className="flex gap-2">
                              {[
                                { val: "yes", label: "Yes" },
                                { val: "no", label: "No, recently graduated" }
                              ].map(o => (
                                <button
                                  key={o.val}
                                  type="button"
                                  onClick={() => setCandidateType({ ...candidateType, fresherStudying: o.val })}
                                  className={`px-4 py-2 border rounded-lg text-xs sm:text-sm font-semibold transition-all ${candidateType.fresherStudying === o.val
                                    ? "bg-[#eef7ff] text-[#0076d8] border-[#0076d8]"
                                    : "bg-white text-[#5b5f70] border-[#e3e5ee] hover:bg-slate-50"
                                    }`}
                                >
                                  {o.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {candidateType.candType === "experienced" && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Current Company <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={candidateType.currentCompany}
                                onChange={e => setCandidateType({ ...candidateType, currentCompany: e.target.value })}
                                placeholder="e.g. Meta Marketing"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.currentCompany && <span className="text-red-500 text-[10px] mt-1">{stepErrors.currentCompany}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Designation <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={candidateType.designation}
                                onChange={e => setCandidateType({ ...candidateType, designation: e.target.value })}
                                placeholder="e.g. Social Media Executive"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.designation && <span className="text-red-500 text-[10px] mt-1">{stepErrors.designation}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Employment Status <span className="text-red-500">*</span></label>
                              <select
                                value={candidateType.employmentStatus}
                                onChange={e => setCandidateType({ ...candidateType, employmentStatus: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              >
                                <option value="">Select</option>
                                <option value="Currently working">Currently working</option>
                                <option value="Serving notice period">Serving notice period</option>
                                <option value="Not currently employed">Not currently employed</option>
                              </select>
                              {stepErrors.employmentStatus && <span className="text-red-500 text-[10px] mt-1">{stepErrors.employmentStatus}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Industry <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                              <input
                                type="text"
                                value={candidateType.industry}
                                onChange={e => setCandidateType({ ...candidateType, industry: e.target.value })}
                                placeholder="e.g. E-commerce"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Total Experience <span className="text-red-500">*</span></label>
                              <select
                                value={candidateType.totalExperience}
                                onChange={e => setCandidateType({ ...candidateType, totalExperience: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              >
                                <option value="">Select</option>
                                <option value="0–1 years">0–1 years</option>
                                <option value="1–2 years">1–2 years</option>
                                <option value="2–4 years">2–4 years</option>
                                <option value="4–6 years">4–6 years</option>
                                <option value="6–10 years">6–10 years</option>
                                <option value="10+ years">10+ years</option>
                              </select>
                              {stepErrors.totalExperience && <span className="text-red-500 text-[10px] mt-1">{stepErrors.totalExperience}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Relevant Experience <span className="text-red-500">*</span></label>
                              <select
                                value={candidateType.relevantExperience}
                                onChange={e => setCandidateType({ ...candidateType, relevantExperience: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              >
                                <option value="">Select</option>
                                <option value="0–1 years">0–1 years</option>
                                <option value="1–2 years">1–2 years</option>
                                <option value="2–4 years">2–4 years</option>
                                <option value="4–6 years">4–6 years</option>
                                <option value="6–10 years">6–10 years</option>
                                <option value="10+ years">10+ years</option>
                              </select>
                              {stepErrors.relevantExperience && <span className="text-red-500 text-[10px] mt-1">{stepErrors.relevantExperience}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Current CTC (₹ / yr) <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                              <input
                                type="text"
                                value={candidateType.currentCtc}
                                onChange={e => setCandidateType({ ...candidateType, currentCtc: e.target.value })}
                                placeholder="e.g. 6,00,000"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Expected CTC (₹ / yr) <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={candidateType.expectedCtc}
                                onChange={e => setCandidateType({ ...candidateType, expectedCtc: e.target.value })}
                                placeholder="e.g. 8,00,000"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.expectedCtc && <span className="text-red-500 text-[10px] mt-1">{stepErrors.expectedCtc}</span>}
                            </div>
                            <div className="flex flex-col sm:col-span-2">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Notice Period <span className="text-red-500">*</span></label>
                              <select
                                value={candidateType.noticePeriod}
                                onChange={e => setCandidateType({ ...candidateType, noticePeriod: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                              >
                                <option value="">Select Notice Period</option>
                                <option value="immediate">Immediate</option>
                                <option value="15">15 Days</option>
                                <option value="30">30 Days</option>
                                <option value="60">60 Days</option>
                                <option value="90">90 Days</option>
                              </select>
                              {stepErrors.noticePeriod && <span className="text-red-500 text-[10px] mt-1">{stepErrors.noticePeriod}</span>}
                            </div>
                          </div>

                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0076d8] mt-6 mb-3 flex items-center gap-2">
                            <span>Previous Companies</span>
                            <div className="flex-1 h-[1px] bg-[#e3e5ee]" />
                          </div>

                          <div className="space-y-4">
                            {candidateType.prevCompanies.map((comp, idx) => (
                              <div key={idx} className="border border-[#e3e5ee] rounded-xl p-4 relative pt-6 bg-[#fafbff]">
                                <span className="absolute top-2 left-3 bg-white border px-2 py-0.5 rounded text-[10px] uppercase font-bold text-[#0076d8]">
                                  Previous Company {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removePrevCompany(idx)}
                                  className="absolute top-2 right-3 text-red-550 hover:text-red-750 text-[11px] font-bold"
                                >
                                  Remove
                                </button>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Company Name *</label>
                                    <input
                                      type="text"
                                      required
                                      value={comp.companyName}
                                      onChange={e => handlePrevCompanyChange(idx, "companyName", e.target.value)}
                                      className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Designation *</label>
                                    <input
                                      type="text"
                                      required
                                      value={comp.designation}
                                      onChange={e => handlePrevCompanyChange(idx, "designation", e.target.value)}
                                      className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1">Employment Type *</label>
                                    <select
                                      value={comp.empType}
                                      onChange={e => handlePrevCompanyChange(idx, "empType", e.target.value)}
                                      className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                                    >
                                      <option value="">Select</option>
                                      <option value="Full-time">Full-time</option>
                                      <option value="Part-time">Part-time</option>
                                      <option value="Contract">Contract</option>
                                      <option value="Internship">Internship</option>
                                    </select>
                                  </div>
                                  <div className="flex grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold mb-1">Start Date *</label>
                                      <input
                                        type="date"
                                        value={comp.startDate}
                                        onChange={e => handlePrevCompanyChange(idx, "startDate", e.target.value)}
                                        className="px-2 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <label className="text-xs font-semibold mb-1">End Date *</label>
                                      <input
                                        type="date"
                                        disabled={comp.currWork}
                                        value={comp.endDate}
                                        onChange={e => handlePrevCompanyChange(idx, "endDate", e.target.value)}
                                        className="px-2 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs disabled:opacity-50"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={comp.currWork}
                                    onChange={e => handlePrevCompanyChange(idx, "currWork", e.target.checked)}
                                    className="w-4 h-4"
                                    id={`currWorkCheck_${idx}`}
                                  />
                                  <label htmlFor={`currWorkCheck_${idx}`} className="text-xs text-[#5b5f70] font-semibold">Currently working here</label>
                                </div>

                                <div className="flex flex-col mt-2">
                                  <label className="text-xs font-semibold mb-1">Responsibilities <span className="font-normal text-[#5b5f70]">(optional)</span></label>
                                  <textarea
                                    value={comp.responsibilities}
                                    onChange={e => handlePrevCompanyChange(idx, "responsibilities", e.target.value)}
                                    className="px-3 py-1.5 border border-[#e3e5ee] bg-white rounded-lg text-xs min-h-[50px] resize-y"
                                  />
                                </div>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={addPrevCompany}
                              className="w-full py-2.5 border border-dashed border-[#a1d1f7] hover:border-[#0076d8] text-[#0076d8] rounded-xl font-bold text-xs transition-colors bg-[#eef7ff]/40"
                            >
                              + Add another previous company
                            </button>
                          </div>
                        </div>
                      )}

                      {candidateType.candType === "internship" && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">College <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={candidateType.college}
                                onChange={e => setCandidateType({ ...candidateType, college: e.target.value })}
                                placeholder="e.g. SPPU University"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.college && <span className="text-red-500 text-[10px] mt-1">{stepErrors.college}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">University <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                              <input
                                type="text"
                                value={candidateType.university}
                                onChange={e => setCandidateType({ ...candidateType, university: e.target.value })}
                                placeholder="Affiliated university"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Degree / Branch <span className="text-red-500">*</span></label>
                              <select
                                value={getBranchSelectVal(candidateType.degree)}
                                onChange={e => {
                                  setCandidateType({ ...candidateType, degree: e.target.value, branch: "" });
                                }}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white cursor-pointer outline-none focus:ring-1 focus:ring-[#0D47A1]"
                              >
                                <option value="">Select Degree/Branch</option>
                                <option value="B.TECH">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="Diploma">Diploma</option>
                                <option value="B.COM">B.Com</option>
                                <option value="MBA">MBA</option>
                                <option value="BSC">B.Sc</option>
                                <option value="DCA">DCA</option>
                                <option value="BBA">BBA</option>
                                <option value="CA">CA</option>
                                <option value="OTHER">Other</option>
                              </select>
                              {getBranchSelectVal(candidateType.degree) === "OTHER" && (
                                <input
                                  type="text"
                                  value={candidateType.degree === "OTHER" ? "" : candidateType.degree}
                                  onChange={e => setCandidateType({ ...candidateType, degree: e.target.value })}
                                  placeholder="Type your degree/branch name..."
                                  className="mt-1.5 px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm outline-none focus:ring-1 focus:ring-[#0D47A1]"
                                />
                              )}
                              {stepErrors.degree && <span className="text-red-500 text-[10px] mt-1">{stepErrors.degree}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Specialization <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                              <select
                                disabled={!candidateType.degree}
                                value={getSpecSelectVal(candidateType.degree, candidateType.branch)}
                                onChange={e => setCandidateType({ ...candidateType, branch: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white cursor-pointer outline-none focus:ring-1 focus:ring-[#0D47A1] disabled:opacity-50 disabled:bg-slate-50"
                              >
                                <option value="">Select Specialization</option>
                                {candidateType.degree && (SPECIALIZATION_MAP[getBranchSelectVal(candidateType.degree)] || []).map(spec => (
                                  <option key={spec} value={spec}>{spec}</option>
                                ))}
                                {candidateType.degree && <option value="other">Other</option>}
                              </select>
                              {getSpecSelectVal(candidateType.degree, candidateType.branch) === "other" && candidateType.degree && (
                                <input
                                  type="text"
                                  value={candidateType.branch === "other" ? "" : candidateType.branch}
                                  onChange={e => setCandidateType({ ...candidateType, branch: e.target.value })}
                                  placeholder="Type specialization name..."
                                  className="mt-1.5 px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm outline-none focus:ring-1 focus:ring-[#0D47A1]"
                                />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Semester *</label>
                              <input
                                type="text"
                                value={candidateType.semester}
                                onChange={e => setCandidateType({ ...candidateType, semester: e.target.value })}
                                placeholder="e.g. 5th"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.semester && <span className="text-red-500 text-[10px] mt-1">{stepErrors.semester}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Expected Graduation Year *</label>
                              <input
                                type="number"
                                value={candidateType.expectedGradYear}
                                onChange={e => setCandidateType({ ...candidateType, expectedGradYear: e.target.value })}
                                placeholder="e.g. 2027"
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.expectedGradYear && <span className="text-red-500 text-[10px] mt-1">{stepErrors.expectedGradYear}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Internship Duration *</label>
                              <select
                                value={candidateType.duration}
                                onChange={e => setCandidateType({ ...candidateType, duration: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              >
                                <option value="">Select</option>
                                <option value="1 month">1 month</option>
                                <option value="2 months">2 months</option>
                                <option value="3 months">3 months</option>
                                <option value="6 months">6 months</option>
                                <option value="Flexible">Flexible</option>
                              </select>
                              {stepErrors.duration && <span className="text-red-500 text-[10px] mt-1">{stepErrors.duration}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Available From *</label>
                              <input
                                type="date"
                                value={candidateType.availableFrom}
                                onChange={e => setCandidateType({ ...candidateType, availableFrom: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white"
                              />
                              {stepErrors.availableFrom && <span className="text-red-500 text-[10px] mt-1">{stepErrors.availableFrom}</span>}
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Paid / Unpaid Preference *</label>
                              <select
                                value={candidateType.stipendPref}
                                onChange={e => setCandidateType({ ...candidateType, stipendPref: e.target.value })}
                                className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                              >
                                <option value="">Select Preference</option>
                                <option value="paid">Paid only</option>
                                <option value="unpaid">Open to unpaid</option>
                                <option value="either">Either is fine</option>
                              </select>
                              {stepErrors.stipendPref && <span className="text-red-500 text-[10px] mt-1">{stepErrors.stipendPref}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(2)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep(2)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: EDUCATION */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#0076d8]" />
                        <span>Education Details</span>
                      </h2>
                      <p className="text-xs text-[#5b5f70] mb-4">Add every qualification you'd like considered. Fields adjust automatically if you're still studying.</p>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="space-y-6">
                        {educationList.map((edu, idx) => (
                          <div key={idx} className="border border-[#e3e5ee] rounded-xl p-5 relative pt-7 bg-[#fafbff]">
                            <span className="absolute top-2.5 left-3.5 bg-white border px-2.5 py-0.5 rounded text-[10px] uppercase font-bold text-[#0076d8]">
                              Education {idx + 1}
                            </span>
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => removeEducation(idx)}
                                className="absolute top-2.5 right-3.5 text-red-550 hover:text-red-750 text-[11px] font-bold"
                              >
                                Remove
                              </button>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Education Level *</label>
                                <select
                                  value={edu.eduLevel}
                                  onChange={e => handleEduChange(idx, "eduLevel", e.target.value)}
                                  className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                                >
                                  <option value="">Select</option>
                                  <option value="10th / Secondary">10th / Secondary</option>
                                  <option value="12th / Higher Secondary">12th / Higher Secondary</option>
                                  <option value="Diploma">Diploma</option>
                                  <option value="Graduate">Graduate</option>
                                  <option value="Post Graduate">Post Graduate</option>
                                  <option value="Doctorate">Doctorate</option>
                                </select>
                                {stepErrors[`edu_${idx}_level`] && <span className="text-red-500 text-[10px] mt-1">{stepErrors[`edu_${idx}_level`]}</span>}
                              </div>

                              <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Institute *</label>
                                <input
                                  type="text"
                                  value={edu.institute}
                                  onChange={e => handleEduChange(idx, "institute", e.target.value)}
                                  placeholder="College / School name"
                                  className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                                />
                                {stepErrors[`edu_${idx}_inst`] && <span className="text-red-500 text-[10px] mt-1">{stepErrors[`edu_${idx}_inst`]}</span>}
                              </div>

                               <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Branch / Stream <span className="text-xs font-normal text-[#5b5f70]">(optional)</span></label>
                                <select
                                  value={getBranchSelectVal(edu.branch)}
                                  onChange={e => {
                                    handleEduChange(idx, "branch", e.target.value);
                                    handleEduChange(idx, "specialization", "");
                                  }}
                                  className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm cursor-pointer outline-none focus:ring-1 focus:ring-[#0D47A1]"
                                >
                                  <option value="">Select Branch</option>
                                  <option value="B.TECH">B.Tech</option>
                                  <option value="M.Tech">M.Tech</option>
                                  <option value="Diploma">Diploma</option>
                                  <option value="B.COM">B.Com</option>
                                  <option value="MBA">MBA</option>
                                  <option value="BSC">B.Sc</option>
                                  <option value="DCA">DCA</option>
                                  <option value="BBA">BBA</option>
                                  <option value="CA">CA</option>
                                  <option value="OTHER">Other</option>
                                </select>
                                {getBranchSelectVal(edu.branch) === "OTHER" && (
                                  <input
                                    type="text"
                                    value={edu.branch === "OTHER" ? "" : edu.branch}
                                    onChange={e => handleEduChange(idx, "branch", e.target.value)}
                                    placeholder="Type your branch name..."
                                    className="mt-1.5 px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm outline-none focus:ring-1 focus:ring-[#0D47A1]"
                                  />
                                )}
                              </div>

                              <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1">Specialization <span className="text-xs font-normal text-[#5b5f70]">(optional)</span></label>
                                <select
                                  disabled={!edu.branch}
                                  value={getSpecSelectVal(edu.branch, edu.specialization)}
                                  onChange={e => handleEduChange(idx, "specialization", e.target.value)}
                                  className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm cursor-pointer outline-none focus:ring-1 focus:ring-[#0D47A1] disabled:opacity-50 disabled:bg-slate-50"
                                >
                                  <option value="">Select Specialization</option>
                                  {edu.branch && (SPECIALIZATION_MAP[getBranchSelectVal(edu.branch)] || []).map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                  ))}
                                  {edu.branch && <option value="other">Other</option>}
                                </select>
                                {getSpecSelectVal(edu.branch, edu.specialization) === "other" && edu.branch && (
                                  <input
                                    type="text"
                                    value={edu.specialization === "other" ? "" : edu.specialization}
                                    onChange={e => handleEduChange(idx, "specialization", e.target.value)}
                                    placeholder="Type specialization name..."
                                    className="mt-1.5 px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm outline-none focus:ring-1 focus:ring-[#0D47A1]"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 mb-2">
                              <input
                                type="checkbox"
                                checked={edu.currStudy}
                                onChange={e => handleEduChange(idx, "currStudy", e.target.checked)}
                                className="w-4 h-4"
                                id={`currStudyCheck_${idx}`}
                              />
                              <label htmlFor={`currStudyCheck_${idx}`} className="text-xs text-[#5b5f70] font-semibold">Currently studying this qualification</label>
                            </div>

                            {!edu.currStudy ? (
                              <div className="flex flex-col mt-2 max-w-xs">
                                <label className="text-xs font-semibold mb-1">Passout Year *</label>
                                <input
                                  type="number"
                                  value={edu.passoutYear}
                                  onChange={e => handleEduChange(idx, "passoutYear", e.target.value)}
                                  className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs"
                                />
                                {stepErrors[`edu_${idx}_year`] && <span className="text-red-500 text-[10px] mt-1">{stepErrors[`edu_${idx}_year`]}</span>}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold mb-1">Semester *</label>
                                  <input
                                    type="text"
                                    value={edu.semester}
                                    onChange={e => handleEduChange(idx, "semester", e.target.value)}
                                    placeholder="e.g. 5th"
                                    className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs"
                                  />
                                  {stepErrors[`edu_${idx}_sem`] && <span className="text-red-500 text-[10px] mt-1">{stepErrors[`edu_${idx}_sem`]}</span>}
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-xs font-semibold mb-1">Expected Graduation Year *</label>
                                  <input
                                    type="number"
                                    value={edu.expGrad}
                                    onChange={e => handleEduChange(idx, "expGrad", e.target.value)}
                                    placeholder="e.g. 2027"
                                    className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs"
                                  />
                                  {stepErrors[`edu_${idx}_expGrad`] && <span className="text-red-500 text-[10px] mt-1">{stepErrors[`edu_${idx}_expGrad`]}</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addEducation}
                        className="w-full py-2.5 border border-dashed border-[#a1d1f7] hover:border-[#0076d8] text-[#0076d8] rounded-xl font-bold text-xs transition-colors bg-[#eef7ff]/40 mt-4"
                      >
                        + Add Education
                      </button>
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(3)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep(3)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: SKILLS */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#0076d8]" />
                        <span>Skills Overview</span>
                      </h2>
                      <p className="text-xs text-[#5b5f70] mb-4">Add your core technical competencies. Use the 'Add' buttons to insert skills.</p>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="flex flex-col mb-4">
                        <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Primary Skills <span className="text-red-500">*</span></label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={primarySkillInput}
                            onChange={e => setPrimarySkillInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPrimarySkill())}
                            placeholder="Type a skill (e.g. SEO, Meta Ads)"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={addPrimarySkill}
                            className="px-4 py-2 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 border border-[#e3e5ee] rounded-lg p-2.5 min-h-[44px] bg-[#f6f7fb]">
                          {skillsPortfolio.primarySkills.length === 0 ? (
                            <span className="text-xs text-[#5b5f70] italic">No skills added yet</span>
                          ) : (
                            skillsPortfolio.primarySkills.map((tag, i) => (
                              <span key={i} className="bg-[#eef7ff] text-[#0076d8] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#a1d1f7]">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removePrimarySkill(i)}
                                  className="text-xs font-bold hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        {stepErrors.primarySkills && <span className="text-red-500 text-[10px] mt-1">{stepErrors.primarySkills}</span>}
                      </div>

                      <div className="flex flex-col mb-4">
                        <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Secondary Skills <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={secondarySkillInput}
                            onChange={e => setSecondarySkillInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSecondarySkill())}
                            placeholder="Type a skill"
                            className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={addSecondarySkill}
                            className="px-4 py-2 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 border border-[#e3e5ee] rounded-lg p-2.5 min-h-[44px] bg-[#f6f7fb]">
                          {skillsPortfolio.secondarySkills.length === 0 ? (
                            <span className="text-xs text-[#5b5f70] italic">No skills added yet</span>
                          ) : (
                            skillsPortfolio.secondarySkills.map((tag, i) => (
                              <span key={i} className="bg-[#eef7ff] text-[#0076d8] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#a1d1f7]">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => setSkillsPortfolio(prev => ({ ...prev, secondarySkills: prev.secondarySkills.filter((_, idx) => idx !== i) }))}
                                  className="text-xs font-bold hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Skill Level <span className="text-red-500">*</span></label>
                          <select
                            value={skillsPortfolio.skillLevel}
                            onChange={e => setSkillsPortfolio({ ...skillsPortfolio, skillLevel: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          {stepErrors.skillLevel && <span className="text-red-500 text-[10px] mt-1">{stepErrors.skillLevel}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[12.5px] font-semibold text-[#14161f] mb-1.5">Languages Known <span className="text-[#5b5f70] font-normal">(optional)</span></label>
                          <input
                            type="text"
                            value={skillsPortfolio.languages}
                            onChange={e => setSkillsPortfolio({ ...skillsPortfolio, languages: e.target.value })}
                            placeholder="e.g. English, Hindi, Marathi"
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(4)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep(4)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: AVAILABILITY */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#0076d8]" />
                        <span>Availability Details</span>
                      </h2>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-semibold mb-1.5">Employment Status *</label>
                          <select
                            value={availability.employmentStatus}
                            onChange={e => setAvailability({ ...availability, employmentStatus: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          >
                            <option value="">Select Status</option>
                            <option value="Actively looking">Actively looking</option>
                            <option value="Open to offers">Open to offers</option>
                            <option value="Not looking, exploring">Not looking, exploring</option>
                          </select>
                          {stepErrors.employmentStatus && <span className="text-red-500 text-[10px] mt-1">{stepErrors.employmentStatus}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs font-semibold mb-1.5">Earliest Joining Date *</label>
                          <input
                            type="date"
                            value={availability.earliestJoiningDate}
                            onChange={e => setAvailability({ ...availability, earliestJoiningDate: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          />
                          {stepErrors.earliestJoiningDate && <span className="text-red-500 text-[10px] mt-1">{stepErrors.earliestJoiningDate}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs font-semibold mb-1.5">Preferred Work Mode *</label>
                          <select
                            value={availability.preferredWorkMode}
                            onChange={e => setAvailability({ ...availability, preferredWorkMode: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          >
                            <option value="">Select Mode</option>
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                          {stepErrors.preferredWorkMode && <span className="text-red-500 text-[10px] mt-1">{stepErrors.preferredWorkMode}</span>}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs font-semibold mb-1.5">Willing to Relocate *</label>
                          <select
                            value={availability.willingToRelocate}
                            onChange={e => setAvailability({ ...availability, willingToRelocate: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          >
                            <option value="">Select Option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="flexible">Flexible</option>
                          </select>
                          {stepErrors.willingToRelocate && <span className="text-red-500 text-[10px] mt-1">{stepErrors.willingToRelocate}</span>}
                        </div>

                        <div className="flex flex-col sm:col-span-2">
                          <label className="text-xs font-semibold mb-1.5">Preferred Interview Time <span className="text-[10px] font-normal text-[#5b5f70]">(optional)</span></label>
                          <input
                            type="time"
                            value={availability.preferredInterviewTime}
                            onChange={e => setAvailability({ ...availability, preferredInterviewTime: e.target.value })}
                            className="px-3 py-2 border border-[#e3e5ee] bg-white rounded-lg text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(5)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep(5)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: DOCUMENTS */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm">
                      <h2 className="text-base sm:text-lg font-bold text-[#14161f] m-0 mb-1 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#0076d8]" />
                        <span>Upload Documents</span>
                      </h2>
                      <hr className="border-t border-[#e3e5ee] mb-4" />

                      <div className="flex flex-col">
                        <label className="text-xs font-semibold mb-2">Upload your resume * <span className="text-[10px] text-[#5b5f70] font-normal">(PDF, DOC, DOCX – max 5MB)</span></label>

                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#fafbff] hover:bg-slate-50/55 ${stepErrors.resume ? "border-red-400 bg-red-50/10" : "border-[#e3e5ee]"
                            }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          {resume ? (
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-[#0076d8] mx-auto mb-2" />
                              <span className="text-xs font-bold text-slate-800">{resume.name}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveResume(); }}
                                className="block text-[11px] text-red-550 hover:text-red-700 font-bold mx-auto mt-2 underline"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-10 h-10 text-[#0076d8] mx-auto mb-2" />
                              <p className="text-xs font-bold text-[#14161f]">Click to browse or drop resume file</p>
                              <p className="text-[10px] text-[#5b5f70] mt-1">PDF, DOC, DOCX up to 5MB</p>
                            </div>
                          )}
                        </div>
                        {stepErrors.resume && <span className="text-red-500 text-[10px] mt-1">{stepErrors.resume}</span>}
                      </div>

                      <div className="flex flex-col mt-6">
                        <label className="text-xs font-semibold mb-2">Why should we consider you? <span className="text-red-500 font-bold">*</span></label>
                        <textarea
                          required
                          value={whyConsider}
                          onChange={e => setWhyConsider(e.target.value)}
                          placeholder="Describe your suitability, skills, and why you are the best fit for this role..."
                          className="px-3 py-2 border border-[#e3e5ee] rounded-lg text-xs sm:text-sm bg-white min-h-[120px] resize-y"
                        />
                        {stepErrors.whyConsider && <span className="text-red-500 text-[10px] mt-1">{stepErrors.whyConsider}</span>}
                      </div>
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(6)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep(6)}
                        className="px-6 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold transition-all shadow-md text-xs sm:text-sm"
                      >
                        Continue to Review →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW & SUBMIT */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    {/* Header Controls for Printing / Saving */}
                    <div className="flex justify-between items-center bg-[#eef7ff] border border-[#a1d1f7] rounded-xl p-3.5 no-print shadow-sm">
                      <span className="text-xs font-bold text-[#0076d8] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#0076d8] animate-pulse" />
                        <span>Receipt Docket Mode Enabled</span>
                      </span>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-3.5 py-1.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Download PDF</span>
                      </button>
                    </div>

                    {/* Receipt Docket Box */}
                    <div className="receipt-print-area bg-white border border-[#e3e5ee] rounded-2xl p-6 sm:p-9 shadow-md relative overflow-hidden">

                      {/* Watermark Centered Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] rotate-[-25deg] z-0">
                        <div className="text-center">
                          <span className="text-[28px] sm:text-[44px] font-black tracking-widest uppercase block">
                            {(generalSettings?.siteTitle || "HOUSLY FINNTECH REALTY").toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Receipt Header Grid */}
                      <div className="relative z-10 grid grid-cols-12 items-center gap-4 border-b border-[#e3e5ee] pb-5 mb-6">
                        {/* Company Logo Left Side */}
                        <div className="col-span-4 flex items-center justify-start">
                          <img
                            src={logos?.navbarLogo || defaultLogo}
                            alt="Company Logo"
                            className="max-h-11 max-w-[150px] object-contain"
                            onError={(e) => {
                              e.currentTarget.src = defaultLogo;
                            }}
                          />
                        </div>

                        {/* Company Name Center Side */}
                        <div className="col-span-4 text-center">
                          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 m-0">
                            {(generalSettings?.siteTitle || "HOUSLY FINNTECH REALTY").toUpperCase()}
                          </h2>
                          <span className="text-[9px] text-[#5b5f70] tracking-wider uppercase font-semibold">
                            Human Resources Dept
                          </span>
                        </div>

                        {/* Reference / Date Right Side */}
                        <div className="col-span-4 text-right">
                          <span className="text-[9px] uppercase font-bold text-[#5b5f70] block">Application Id</span>
                          <span className="text-xs font-black text-[#0076d8] block">#{randomAppId}</span>
                          <span className="text-[9px] text-[#5b5f70] block mt-0.5">Date: {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Receipt Content Layout */}
                      <div className="relative z-10 space-y-6 text-[#14161f]">

                        {/* Docket Application Metadata */}
                        <div className="bg-[#f6f7fb] rounded-xl p-3 border border-[#e3e5ee] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[#5b5f70] font-semibold block">Applying For:</span>
                            <span className="font-bold text-slate-800 text-sm">{job.job_title}</span>
                          </div>
                          <div>
                            <span className="text-[#5b5f70] font-semibold block">Department &amp; Type:</span>
                            <span className="font-bold text-slate-800 text-sm">{job.department} • {job.job_type}</span>
                          </div>
                        </div>

                        {/* 1. Personal Information */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">I. Personal Details</span>
                            <button type="button" onClick={() => setCurrentStep(1)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <tbody>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70] w-1/3">Full Name</td>
                                <td className="py-1.5 font-bold text-slate-800">{`${personalInfo.firstName} ${personalInfo.lastName}`}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Email Address</td>
                                <td className="py-1.5 font-bold text-slate-800">{personalInfo.email}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Mobile Number</td>
                                <td className="py-1.5 font-bold text-slate-800">{personalInfo.mobile}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">WhatsApp Number</td>
                                <td className="py-1.5 font-bold text-slate-800">{personalInfo.whatsapp || "Same as Mobile"}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Gender / DOB</td>
                                <td className="py-1.5 font-bold text-slate-800 capitalize">
                                  {personalInfo.gender === "self" ? personalInfo.selfGender : personalInfo.gender} {personalInfo.dob ? `(Born: ${personalInfo.dob})` : ""}
                                </td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Address Location</td>
                                <td className="py-1.5 font-bold text-slate-800">
                                  {personalInfo.currentAddress ? `${personalInfo.currentAddress}, ` : ""}
                                  {`${personalInfo.currentCity}, ${personalInfo.state}, ${personalInfo.country}`}
                                </td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">LinkedIn Profile</td>
                                <td className="py-1.5 font-bold text-[#0076d8] truncate max-w-[200px] break-all">
                                  {personalInfo.linkedin ? (
                                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
                                  ) : "—"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Portfolio Link</td>
                                <td className="py-1.5 font-bold text-[#0076d8] truncate max-w-[200px] break-all">
                                  {personalInfo.portfolio ? (
                                    <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.portfolio}</a>
                                  ) : "—"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* 2. Candidate Type Details */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">II. Candidate Type &amp; Status</span>
                            <button type="button" onClick={() => setCurrentStep(2)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>

                          <div className="text-xs space-y-1.5">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="font-semibold text-[#5b5f70]">Selected Status</span>
                              <span className="font-bold text-slate-800">
                                {candidateType.candType === "fresher" && "Fresher"}
                                {candidateType.candType === "internship" && "Internship"}
                                {candidateType.candType === "experienced" && "Professional Experience"}
                              </span>
                            </div>

                            {/* Fresher Sub Details */}
                            {candidateType.candType === "fresher" && (
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-semibold text-[#5b5f70]">Currently studying?</span>
                                <span className="font-bold text-slate-800 capitalize">{candidateType.fresherStudying}</span>
                              </div>
                            )}

                            {/* Internship Sub Details */}
                            {candidateType.candType === "internship" && (
                              <>
                                <div className="grid grid-cols-2 gap-3 py-1 border-b border-slate-100">
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">College / University</span>
                                    <span className="font-bold text-slate-800">{candidateType.college} {candidateType.university ? `(${candidateType.university})` : ""}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Degree &amp; Branch</span>
                                    <span className="font-bold text-slate-800">{candidateType.degree} {candidateType.branch ? `— ${candidateType.branch}` : ""}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 py-1 border-b border-slate-100">
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Semester / Grad Year</span>
                                    <span className="font-bold text-slate-800">{candidateType.semester} / {candidateType.expectedGradYear}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Duration / Available From</span>
                                    <span className="font-bold text-slate-800">{candidateType.duration} / {candidateType.availableFrom}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Stipend Preference</span>
                                    <span className="font-bold text-slate-800 capitalize">{candidateType.stipendPref}</span>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Experienced Sub Details */}
                            {candidateType.candType === "experienced" && (
                              <>
                                <div className="grid grid-cols-2 gap-3 py-1 border-b border-slate-100">
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Current Company &amp; Designation</span>
                                    <span className="font-bold text-slate-800">{candidateType.currentCompany} — {candidateType.designation}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Employment Status &amp; Industry</span>
                                    <span className="font-bold text-slate-800">{candidateType.employmentStatus} {candidateType.industry ? `(${candidateType.industry})` : ""}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 py-1 border-b border-slate-100">
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Total / Relevant Exp</span>
                                    <span className="font-bold text-slate-800">{candidateType.totalExperience} / {candidateType.relevantExperience}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Current / Expected CTC</span>
                                    <span className="font-bold text-slate-800">₹{candidateType.currentCtc || "—"} / ₹{candidateType.expectedCtc}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#5b5f70] block font-semibold">Notice Period</span>
                                    <span className="font-bold text-slate-800 capitalize">{candidateType.noticePeriod}</span>
                                  </div>
                                </div>

                                {candidateType.prevCompanies.length > 0 && (
                                  <div className="pt-2">
                                    <span className="text-[10px] font-bold text-[#5b5f70] block uppercase tracking-wider mb-1.5">Previous Work History</span>
                                    <div className="space-y-2">
                                      {candidateType.prevCompanies.map((c, i) => (
                                        <div key={i} className="border border-slate-100 rounded-lg p-2 bg-slate-50/40 text-xs">
                                          <div className="font-bold text-slate-800">{c.companyName} ({c.designation})</div>
                                          <div className="text-[#5b5f70] text-[10px] mt-0.5">
                                            {c.empType} • {c.startDate} to {c.currWork ? "Present" : c.endDate}
                                          </div>
                                          {c.responsibilities && (
                                            <div className="text-slate-600 text-[10px] mt-1 leading-normal italic">
                                              " {c.responsibilities} "
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* 3. Education List */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">III. Academic Background</span>
                            <button type="button" onClick={() => setCurrentStep(3)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>
                          <div className="space-y-2">
                            {educationList.map((edu, i) => (
                              <div key={i} className="flex justify-between items-start text-xs py-1.5 border-b last:border-none border-slate-100">
                                <div>
                                  <span className="font-bold text-slate-800">{edu.eduLevel}</span>
                                  <span className="text-[#5b5f70] block text-[10px]">{edu.institute} {edu.branch ? `| ${edu.branch}` : ""} {edu.specialization ? `(${edu.specialization})` : ""}</span>
                                </div>
                                <div className="text-right">
                                  <span className="bg-[#eef7ff] text-[#0076d8] border border-[#a1d1f7] text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                                    {edu.currStudy ? "Studying" : `Passed ${edu.passoutYear}`}
                                  </span>
                                  {edu.currStudy && (
                                    <span className="text-[#5b5f70] block text-[9px] mt-0.5">Semester: {edu.semester} (Grad: {edu.expGrad})</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Skills & Competencies */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">IV. Skills &amp; Competencies</span>
                            <button type="button" onClick={() => setCurrentStep(4)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <tbody>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70] w-1/3">Primary Skills</td>
                                <td className="py-1.5 font-bold text-slate-800">{skillsPortfolio.primarySkills.join(", ") || "—"}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Secondary Skills</td>
                                <td className="py-1.5 font-bold text-slate-800">{skillsPortfolio.secondarySkills.join(", ") || "—"}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Skill level</td>
                                <td className="py-1.5 font-bold text-slate-800">{skillsPortfolio.skillLevel}</td>
                              </tr>
                              <tr>
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Languages known</td>
                                <td className="py-1.5 font-bold text-slate-800">{skillsPortfolio.languages || "—"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* 5. Availability details */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">V. Availability &amp; Preferences</span>
                            <button type="button" onClick={() => setCurrentStep(5)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <tbody>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70] w-1/3">Current Status</td>
                                <td className="py-1.5 font-bold text-slate-800">{availability.employmentStatus}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Earliest Join Date</td>
                                <td className="py-1.5 font-bold text-slate-800">{availability.earliestJoiningDate}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Preferred Work Mode</td>
                                <td className="py-1.5 font-bold text-slate-800">{availability.preferredWorkMode}</td>
                              </tr>
                              <tr className="border-b border-slate-100">
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Willing to relocate?</td>
                                <td className="py-1.5 font-bold text-slate-800 capitalize">{availability.willingToRelocate}</td>
                              </tr>
                              <tr>
                                <td className="py-1.5 font-semibold text-[#5b5f70]">Preferred Interview Time</td>
                                <td className="py-1.5 font-bold text-slate-800">{availability.preferredInterviewTime || "Flexible"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* 6. Documents & Candidate statement */}
                        <div>
                          <div className="flex justify-between items-center mb-2 pb-1 border-b border-dashed border-[#e3e5ee]">
                            <span className="text-[11px] font-extrabold uppercase text-[#0076d8] tracking-wider">VI. Documents &amp; Statement</span>
                            <button type="button" onClick={() => setCurrentStep(6)} className="text-[11px] font-bold text-[#0076d8] hover:underline no-print">Edit</button>
                          </div>
                          <div className="text-xs space-y-3">
                            <div>
                              <span className="text-[#5b5f70] font-semibold block">Uploaded Resume:</span>
                              <span className="font-bold text-green-700 flex items-center gap-1.5 mt-0.5">
                                <FileText className="w-3.5 h-3.5" />
                                {resume ? `${resume.name} (${(resume.size / (1024 * 1024)).toFixed(2)} MB)` : "None"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#5b5f70] font-semibold block">Why should we consider you?</span>
                              <p className="text-slate-700 bg-slate-50 border rounded-lg p-3 mt-1 leading-relaxed italic whitespace-pre-line">
                                " {whyConsider} "
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Receipt Footer */}
                      <div className="border-t border-[#e3e5ee] pt-4 mt-6 text-center text-[10px] text-[#5b5f70] font-semibold relative z-10">
                        <span>This is a system generated application docket preview. All data entered has been certified by the applicant.</span>
                        <div className="mt-1.5 flex items-center justify-center gap-1">
                          <Building className="w-3 h-3 text-[#0076d8]" />
                          <span className="font-extrabold text-[#0076d8] uppercase tracking-widest">{(generalSettings?.siteTitle || "HOUSLY FINNTECH REALTY").toUpperCase()} CAREERS</span>
                        </div>
                      </div>

                    </div>

                    {/* Submit Declaration Fields (Hidden on print) */}
                    <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 sm:p-7 shadow-sm no-print">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0076d8] mb-3.5 flex items-center gap-2">
                        <span>Final Declaration</span>
                        <div className="flex-1 h-[1px] bg-[#e3e5ee]" />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-start gap-2.5 text-xs text-[#5b5f70] cursor-pointer">
                          <input type="checkbox" id="decl1" required className="w-4.5 h-4.5 rounded mt-0.5 accent-[#0076d8]" />
                          <span>I certify the information provided is accurate. <span className="text-red-500">*</span></span>
                        </label>
                        <label className="flex items-start gap-2.5 text-xs text-[#5b5f70] cursor-pointer">
                          <input type="checkbox" id="decl2" required className="w-4.5 h-4.5 rounded mt-0.5 accent-[#0076d8]" />
                          <span>I agree to the Privacy Policy. <span className="text-red-500">*</span></span>
                        </label>
                        <label className="flex items-start gap-2.5 text-xs text-[#5b5f70] cursor-pointer">
                          <input type="checkbox" id="decl3" required className="w-4.5 h-4.5 rounded mt-0.5 accent-[#0076d8]" />
                          <span>I agree to the Terms &amp; Conditions. <span className="text-red-500">*</span></span>
                        </label>
                        <label className="flex items-start gap-2.5 text-xs text-[#5b5f70] cursor-pointer">
                          <input type="checkbox" className="w-4.5 h-4.5 rounded mt-0.5 accent-[#0076d8]" />
                          <span>I agree to receive recruitment updates.</span>
                        </label>
                      </div>
                    </div>

                    {/* Step Navigation Controls (Hidden on print) */}
                    <div className="flex justify-between gap-3 mt-4 no-print">
                      <button
                        type="button"
                        onClick={() => handlePrevStep(7)}
                        className="px-6 py-2.5 border border-[#e3e5ee] bg-white text-[#5b5f70] hover:bg-slate-50 transition-colors rounded-xl font-bold text-xs sm:text-sm"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-[#0076d8] hover:bg-[#005eb0] text-white rounded-xl font-bold text-xs sm:text-sm transition-all hover:shadow-md flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column - Persistent Job Summary & Info Panel (Fixed/Sticky Sidebar) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="space-y-6">

                {/* Job Summary Card */}
                <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 shadow-sm">
                  <h3 className="text-base font-extrabold text-[#14161f] mb-3 pb-2 border-b flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#0076d8]" />
                    <span>Job Summary</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-[#5b5f70]">Position:</span>
                      <span className="text-xs font-bold text-right text-slate-800">{job.job_title}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-[#5b5f70]">Department:</span>
                      <span className="text-xs font-bold text-right text-slate-800">{job.department || "General"}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-[#5b5f70]">Job Type:</span>
                      <span className="text-xs font-bold text-right text-slate-800 capitalize">{job.job_type}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-[#5b5f70]">Location:</span>
                      <span className="text-xs font-bold text-right text-slate-800">{job.location || "Pune, India"}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-start justify-between">
                        <span className="text-xs text-[#5b5f70]">Salary Range:</span>
                        <span className="text-xs font-bold text-[#0f7a52]">{job.salary_range}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Tips */}
                <div className="bg-white border border-[#e3e5ee] rounded-2xl p-5 shadow-sm">
                  <h3 className="text-base font-extrabold text-[#14161f] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4.5 h-4.5 text-[#0f7a52]" />
                    <span>Application Tips</span>
                  </h3>
                  <ul className="space-y-3.5">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 bg-[#eef7ff] text-[#0076d8] font-bold text-[10px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <span className="text-xs text-[#5b5f70] leading-relaxed">
                        Ensure your resume is updated in PDF format with a file size under 5MB.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 bg-[#eef7ff] text-[#0076d8] font-bold text-[10px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <span className="text-xs text-[#5b5f70] leading-relaxed">
                        Select the correct **Candidate Type** so we filter the questions tailored to you.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 bg-[#eef7ff] text-[#0076d8] font-bold text-[10px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <span className="text-xs text-[#5b5f70] leading-relaxed">
                        Fill in all required fields marked with <span className="text-red-500 font-bold">*</span> to proceed through steps.
                      </span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}