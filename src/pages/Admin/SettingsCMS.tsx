

// import { useState, useEffect } from 'react';
// import { Save, Shield, Globe, Mail, Bell, Lock, User, Server, Palette, Image, RefreshCw, Eye, Home, Menu, X } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { settingsApi } from '../../lib/settingsApi';

// const SettingsCMS = () => {
//   const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'notifications'>('general');
//   const [settings, setSettings] = useState({
//     // General
//     siteTitle: 'Hously Finntech Realty',
//     siteDescription: 'Modern IT Solutions Company',
//     contactEmail: 'info@hously.in',
//     contactPhone: '+91 9371 00 9381',
//     siteUrl: 'https://hously.in',
    
//     // Security
//     requireAdminApproval: true,
//     enable2FA: false,
//     sessionTimeout: 30,
//     maxLoginAttempts: 5,
    
//     // Appearance
//     primaryColor: '#0076d8',
//     secondaryColor: '#ffd801',
//     theme: 'light',
//     enableDarkMode: false,
    
//     // Logos
//     navbarLogo: '/images/hously-logo.png',
//     footerLogo: '/images/footer-logo1.png',
//     favicon: '/favicon.png',
    
//     // Notifications
//     emailNotifications: true,
//     adminNotifications: true,
//     jobApplicationAlerts: true,
//     blogCommentAlerts: true,
//   });

//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
//   const [uploading, setUploading] = useState<string | null>(null);
//   const [, setLoading] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Fetch settings on mount
//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       console.log('📥 Fetching logo settings...');
//       const logoData = await settingsApi.getLogos();
      
//       console.log('📥 Settings response:', logoData);
      
//       setSettings(prev => ({
//         ...prev,
//         navbarLogo: logoData.navbarLogo,
//         footerLogo: logoData.footerLogo,
//         favicon: logoData.favicon
//       }));
//     } catch (error: any) {
//       console.error('Failed to fetch settings:', error);
//       toast.error(error.message || 'Failed to load logo settings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setMessage(null);
    
//     try {
//       // Save all settings to backend
//       // You'll need to implement this endpoint
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setMessage({
//         type: 'success',
//         text: 'Settings saved successfully!'
//       });
//       toast.success('Settings saved successfully!');
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         text: 'Failed to save settings. Please try again.'
//       });
//       toast.error('Failed to save settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChange = <K extends keyof typeof settings>(
//     key: K,
//     value: (typeof settings)[K]
//   ) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleUploadLogo = async (type: 'navbar' | 'footer', file: File) => {
//     if (!file) {
//       toast.error('Please select a file');
//       return;
//     }

//     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error(`Invalid file type. Allowed: PNG, JPG, JPEG, SVG, WEBP`);
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('File size should be less than 2MB');
//       return;
//     }

//     const loadingToast = toast.loading(`Uploading ${type} logo...`);
    
//     try {
//       setUploading(type);
//       const result = await settingsApi.uploadLogo(type, file);
//       console.log('📤 Upload result:', result);
      
//       const logoKey = type === 'navbar' ? 'navbarLogo' : 'footerLogo';
//       setSettings(prev => ({
//         ...prev,
//         [logoKey]: result.fullUrl
//       }));
      
//       toast.success(`${type} logo uploaded successfully!`, { id: loadingToast });
      
//       // Refresh settings to get latest data
//       await fetchSettings();
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       toast.error(error.message || `Failed to upload ${type} logo`, { id: loadingToast });
//     } finally {
//       setUploading(null);
//     }
//   };

//   const handleUploadFavicon = async (file: File) => {
//     if (!file) {
//       toast.error('Please select a file');
//       return;
//     }

//     const allowedTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/jpeg', 'image/jpg'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Invalid file type. Allowed: ICO, PNG, JPG, JPEG');
//       return;
//     }

//     if (file.size > 1 * 1024 * 1024) {
//       toast.error('File size should be less than 1MB');
//       return;
//     }

//     const loadingToast = toast.loading('Uploading favicon...');
    
//     try {
//       setUploading('favicon');
//       const result = await settingsApi.uploadFavicon(file);
//       console.log('📤 Favicon upload result:', result);
      
//       setSettings(prev => ({
//         ...prev,
//         favicon: result.fullUrl
//       }));
      
//       toast.success('Favicon uploaded successfully!', { id: loadingToast });
      
//       // Refresh settings to get latest data
//       await fetchSettings();
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload favicon', { id: loadingToast });
//     } finally {
//       setUploading(null);
//     }
//   };

//   const handleResetLogos = async () => {
//     if (!window.confirm('Are you sure you want to reset all logos to defaults?')) return;

//     const loadingToast = toast.loading('Resetting logos...');
    
//     try {
//       const result = await settingsApi.resetLogos();
//       console.log('📤 Reset result:', result);
      
//       setSettings(prev => ({
//         ...prev,
//         navbarLogo: result.navbarLogo,
//         footerLogo: result.footerLogo,
//         favicon: result.favicon
//       }));
      
//       toast.success('Logos reset to defaults successfully!', { id: loadingToast });
      
//       // Refresh settings to get latest data
//       await fetchSettings();
//     } catch (error: any) {
//       console.error('Reset error:', error);
//       toast.error(error.message || 'Failed to reset logos', { id: loadingToast });
//     }
//   };

//   return (
//     <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
//       <Toaster position="top-right" />
      
//       {/* Header - Mobile Optimized */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
//         <div className="flex items-center justify-between w-full sm:w-auto">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
//             <p className="text-sm sm:text-base text-gray-600">Configure your CMS settings</p>
//           </div>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
//           >
//             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
//         >
//           <Save size={20} />
//           <span className="text-sm sm:text-base">{saving ? 'Saving...' : 'Save Changes'}</span>
//         </button>
//       </div>

//       {message && (
//         <div className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
//           {message.text}
//         </div>
//       )}

//       {/* Mobile Tabs Dropdown */}
//       <div className="sm:hidden relative">
//         <select
//           value={activeTab}
//           onChange={(e) => setActiveTab(e.target.value as any)}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white appearance-none"
//         >
//           <option value="general">General Settings</option>
//           <option value="security">Security Settings</option>
//           <option value="appearance">Appearance Settings</option>
//           <option value="notifications">Notification Settings</option>
//         </select>
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//           <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </div>

//       {/* Desktop Tabs */}
//       <div className="hidden sm:block border-b border-gray-200">
//         <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4 md:space-x-8">
//           <button
//             onClick={() => setActiveTab('general')}
//             className={`py-3 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 whitespace-nowrap ${
//               activeTab === 'general'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Globe size={18} />
//             <span>General</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('security')}
//             className={`py-3 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 whitespace-nowrap ${
//               activeTab === 'security'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Shield size={18} />
//             <span>Security</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('appearance')}
//             className={`py-3 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 whitespace-nowrap ${
//               activeTab === 'appearance'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Palette size={18} />
//             <span>Appearance</span>
//           </button>
//           <button
//             onClick={() => setActiveTab('notifications')}
//             className={`py-3 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 whitespace-nowrap ${
//               activeTab === 'notifications'
//                 ? 'border-blue-500 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Bell size={18} />
//             <span>Notifications</span>
//           </button>
//         </nav>
//       </div>

//       {/* Settings Content */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
//         {activeTab === 'general' && (
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">General Settings</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Site Title
//                   </label>
//                   <input
//                     type="text"
//                     value={settings.siteTitle}
//                     onChange={(e) => handleChange('siteTitle', e.target.value)}
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Site Description
//                   </label>
//                   <input
//                     type="text"
//                     value={settings.siteDescription}
//                     onChange={(e) => handleChange('siteDescription', e.target.value)}
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Contact Email
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//                     <input
//                       type="email"
//                       value={settings.contactEmail}
//                       onChange={(e) => handleChange('contactEmail', e.target.value)}
//                       className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Contact Phone
//                   </label>
//                   <input
//                     type="tel"
//                     value={settings.contactPhone}
//                     onChange={(e) => handleChange('contactPhone', e.target.value)}
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Site URL
//                   </label>
//                   <div className="relative">
//                     <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//                     <input
//                       type="url"
//                       value={settings.siteUrl}
//                       onChange={(e) => handleChange('siteUrl', e.target.value)}
//                       className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'security' && (
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Security Settings</h3>
//               <div className="space-y-3 sm:space-y-4">
//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Require Admin Approval</p>
//                       <p className="text-xs sm:text-sm text-gray-500">All new registrations require admin approval</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.requireAdminApproval}
//                     onChange={(e) => handleChange('requireAdminApproval', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>

//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Enable Two-Factor Authentication</p>
//                       <p className="text-xs sm:text-sm text-gray-500">Add an extra layer of security to admin accounts</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.enable2FA}
//                     onChange={(e) => handleChange('enable2FA', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>

//                 <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Session Timeout (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     value={settings.sessionTimeout}
//                     onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
//                     min="5"
//                     max="120"
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   />
//                 </div>

//                 <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Maximum Login Attempts
//                   </label>
//                   <input
//                     type="number"
//                     value={settings.maxLoginAttempts}
//                     onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
//                     min="1"
//                     max="10"
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'appearance' && (
//           <div className="space-y-4 sm:space-y-6">
//             {/* Color Settings */}
//             <div>
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Color & Theme</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Primary Color
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="color"
//                       value={settings.primaryColor}
//                       onChange={(e) => handleChange('primaryColor', e.target.value)}
//                       className="w-10 h-10 sm:w-12 sm:h-12 rounded border border-gray-300 cursor-pointer flex-shrink-0"
//                     />
//                     <input
//                       type="text"
//                       value={settings.primaryColor}
//                       onChange={(e) => handleChange('primaryColor', e.target.value)}
//                       className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Secondary Color
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="color"
//                       value={settings.secondaryColor}
//                       onChange={(e) => handleChange('secondaryColor', e.target.value)}
//                       className="w-10 h-10 sm:w-12 sm:h-12 rounded border border-gray-300 cursor-pointer flex-shrink-0"
//                     />
//                     <input
//                       type="text"
//                       value={settings.secondaryColor}
//                       onChange={(e) => handleChange('secondaryColor', e.target.value)}
//                       className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Theme
//                   </label>
//                   <select
//                     value={settings.theme}
//                     onChange={(e) => handleChange('theme', e.target.value)}
//                     className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
//                   >
//                     <option value="light">Light</option>
//                     <option value="dark">Dark</option>
//                     <option value="auto">Auto (System Preference)</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center">
//                   <label className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-6">
//                     <input
//                       type="checkbox"
//                       checked={settings.enableDarkMode}
//                       onChange={(e) => handleChange('enableDarkMode', e.target.checked)}
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700">Enable Dark Mode Toggle</span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Logo Management */}
//             <div>
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
//                 <h3 className="text-base sm:text-lg font-medium text-gray-900">Logo Management</h3>
//                 <button
//                   onClick={handleResetLogos}
//                   className="text-xs sm:text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
//                 >
//                   <RefreshCw size={14} />
//                   <span>Reset to Defaults</span>
//                 </button>
//               </div>
//               <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
//                 Upload custom logos and favicon for your website. Recommended sizes: Navbar Logo (200x50px), Footer Logo (180x45px), Favicon (32x32px).
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 {/* Navbar Logo */}
//                 <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
//                     <div className="flex items-center space-x-2">
//                       <Home className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
//                       <h4 className="font-medium text-gray-900 text-sm sm:text-base">Navbar Logo</h4>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded self-start sm:self-auto">
//                       200x50
//                     </span>
//                   </div>
                  
//                   <div className="mb-3 sm:mb-4">
//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-24 sm:h-32 flex items-center justify-center">
//                       {settings.navbarLogo ? (
//                         <img
//                           src={settings.navbarLogo}
//                           alt="Navbar Logo Preview"
//                           className="max-h-16 sm:max-h-20 max-w-full object-contain"
//                           onError={(e) => {
//                             e.currentTarget.src = '/images/hously-logo.png';
//                           }}
//                         />
//                       ) : (
//                         <div className="text-center text-gray-400">
//                           <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" />
//                           <p className="text-xs sm:text-sm">No logo uploaded</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept=".png,.jpg,.jpeg,.svg,.webp"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) handleUploadLogo('navbar', file);
//                           e.target.value = '';
//                         }}
//                         className="hidden"
//                         disabled={uploading === 'navbar'}
//                       />
//                       <div className={`w-full px-3 sm:px-4 py-2 rounded-lg cursor-pointer text-center transition text-sm sm:text-base ${uploading === 'navbar' ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
//                         {uploading === 'navbar' ? 'Uploading...' : 'Upload Logo'}
//                       </div>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Footer Logo */}
//                 <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
//                     <div className="flex items-center space-x-2">
//                       <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
//                       <h4 className="font-medium text-gray-900 text-sm sm:text-base">Footer Logo</h4>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded self-start sm:self-auto">
//                       180x45
//                     </span>
//                   </div>
                  
//                   <div className="mb-3 sm:mb-4">
//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-24 sm:h-32 flex items-center justify-center">
//                       {settings.footerLogo ? (
//                         <img
//                           src={settings.footerLogo}
//                           alt="Footer Logo Preview"
//                           className="max-h-16 sm:max-h-20 max-w-full object-contain"
//                           onError={(e) => {
//                             e.currentTarget.src = '/images/footer-logo1.png';
//                           }}
//                         />
//                       ) : (
//                         <div className="text-center text-gray-400">
//                           <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" />
//                           <p className="text-xs sm:text-sm">No logo uploaded</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept=".png,.jpg,.jpeg,.svg,.webp"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) handleUploadLogo('footer', file);
//                           e.target.value = '';
//                         }}
//                         className="hidden"
//                         disabled={uploading === 'footer'}
//                       />
//                       <div className={`w-full px-3 sm:px-4 py-2 rounded-lg cursor-pointer text-center transition text-sm sm:text-base ${uploading === 'footer' ? 'bg-gray-100 text-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
//                         {uploading === 'footer' ? 'Uploading...' : 'Upload Logo'}
//                       </div>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Favicon */}
//                 <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
//                     <div className="flex items-center space-x-2">
//                       <Image className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//                       <h4 className="font-medium text-gray-900 text-sm sm:text-base">Favicon</h4>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded self-start sm:self-auto">
//                       32x32
//                     </span>
//                   </div>
                  
//                   <div className="mb-3 sm:mb-4">
//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-24 sm:h-32 flex items-center justify-center">
//                       {settings.favicon ? (
//                         <div className="text-center">
//                           <img
//                             src={settings.favicon}
//                             alt="Favicon Preview"
//                             className="w-12 h-12 sm:w-16 sm:h-16 mx-auto object-contain"
//                             onError={(e) => {
//                               e.currentTarget.src = '/favicon.png';
//                             }}
//                           />
//                           <p className="text-xs text-gray-500 mt-1 sm:mt-2">Browser Tab Icon</p>
//                         </div>
//                       ) : (
//                         <div className="text-center text-gray-400">
//                           <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" />
//                           <p className="text-xs sm:text-sm">No favicon uploaded</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block">
//                       <input
//                         type="file"
//                         accept=".ico,.png,.jpg,.jpeg"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) handleUploadFavicon(file);
//                           e.target.value = '';
//                         }}
//                         className="hidden"
//                         disabled={uploading === 'favicon'}
//                       />
//                       <div className={`w-full px-3 sm:px-4 py-2 rounded-lg cursor-pointer text-center transition text-sm sm:text-base ${uploading === 'favicon' ? 'bg-gray-100 text-gray-400' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
//                         {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
//                       </div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <h4 className="font-medium text-blue-900 mb-1 sm:mb-2 flex items-center space-x-2 text-sm sm:text-base">
//                   <Eye size={16} />
//                   <span>Preview</span>
//                 </h4>
//                 <p className="text-xs sm:text-sm text-blue-700">
//                   Changes to logos will be reflected immediately on your website. The favicon will appear in browser tabs and bookmarks.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'notifications' && (
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Notification Settings</h3>
//               <div className="space-y-3 sm:space-y-4">
//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Email Notifications</p>
//                       <p className="text-xs sm:text-sm text-gray-500">Receive email alerts for important events</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.emailNotifications}
//                     onChange={(e) => handleChange('emailNotifications', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>

//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Admin Notifications</p>
//                       <p className="text-xs sm:text-sm text-gray-500">Send notifications to admin users</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.adminNotifications}
//                     onChange={(e) => handleChange('adminNotifications', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>

//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Job Application Alerts</p>
//                       <p className="text-xs sm:text-sm text-gray-500">Get notified when someone applies for a job</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.jobApplicationAlerts}
//                     onChange={(e) => handleChange('jobApplicationAlerts', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>

//                 <label className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <Server className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-gray-900 text-sm sm:text-base">Blog Comment Alerts</p>
//                       <p className="text-xs sm:text-sm text-gray-500">Receive notifications for new blog comments</p>
//                     </div>
//                   </div>
//                   <input
//                     type="checkbox"
//                     checked={settings.blogCommentAlerts}
//                     onChange={(e) => handleChange('blogCommentAlerts', e.target.checked)}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 sm:pt-6 border-t">
//         <div className="text-xs sm:text-sm text-gray-500">
//           Changes will take effect immediately after saving.
//         </div>
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
//         >
//           <Save size={18} />
//           <span className="text-sm sm:text-base">{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SettingsCMS;



import { useState, useEffect } from 'react';
import { Save, Shield, Globe, Mail, Bell, Lock, User, Server, Palette, Image, RefreshCw, Eye, Home, Menu, X, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { settingsApi } from '../../lib/settingsApi';

const SettingsCMS = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'appearance' | 'notifications'>('general');
  const [settings, setSettings] = useState({
    siteTitle: 'Hously Finntech Realty',
    siteDescription: 'Modern IT Solutions Company',
    contactEmail: 'careers@hously.in',
    contactPhone: '+91 9371 00 9381',
    siteUrl: 'https://hously.in',
    requireAdminApproval: true,
    enable2FA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    primaryColor: '#0076d8',
    secondaryColor: '#ffd801',
    theme: 'light',
    enableDarkMode: false,
    navbarLogo: '/images/hously-logo.png',
    footerLogo: '/images/footer-logo1.png',
    favicon: '/favicon.png',
    emailNotifications: true,
    adminNotifications: true,
    jobApplicationAlerts: true,
    blogCommentAlerts: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const logoData = await settingsApi.getLogos();
      setSettings(prev => ({ ...prev, navbarLogo: logoData.navbarLogo, footerLogo: logoData.footerLogo, favicon: logoData.favicon }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load logo settings');
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true); setMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      toast.success('Settings saved successfully!');
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      toast.error('Failed to save settings');
    } finally { setSaving(false); }
  };

  const handleChange = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUploadLogo = async (type: 'navbar' | 'footer', file: File) => {
    if (!file) { toast.error('Please select a file'); return; }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) { toast.error('Invalid file type. Allowed: PNG, JPG, JPEG, SVG, WEBP'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('File size should be less than 2MB'); return; }
    const loadingToast = toast.loading(`Uploading ${type} logo...`);
    try {
      setUploading(type);
      const result = await settingsApi.uploadLogo(type, file);
      const logoKey = type === 'navbar' ? 'navbarLogo' : 'footerLogo';
      setSettings(prev => ({ ...prev, [logoKey]: result.fullUrl }));
      toast.success(`${type} logo uploaded successfully!`, { id: loadingToast });
      await fetchSettings();
    } catch (error: any) {
      toast.error(error.message || `Failed to upload ${type} logo`, { id: loadingToast });
    } finally { setUploading(null); }
  };

  const handleUploadFavicon = async (file: File) => {
    if (!file) { toast.error('Please select a file'); return; }
    const allowedTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) { toast.error('Invalid file type. Allowed: ICO, PNG, JPG, JPEG'); return; }
    if (file.size > 1 * 1024 * 1024) { toast.error('File size should be less than 1MB'); return; }
    const loadingToast = toast.loading('Uploading favicon...');
    try {
      setUploading('favicon');
      const result = await settingsApi.uploadFavicon(file);
      setSettings(prev => ({ ...prev, favicon: result.fullUrl }));
      toast.success('Favicon uploaded successfully!', { id: loadingToast });
      await fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload favicon', { id: loadingToast });
    } finally { setUploading(null); }
  };

  const handleResetLogos = async () => {
    if (!window.confirm('Are you sure you want to reset all logos to defaults?')) return;
    const loadingToast = toast.loading('Resetting logos...');
    try {
      const result = await settingsApi.resetLogos();
      setSettings(prev => ({ ...prev, navbarLogo: result.navbarLogo, footerLogo: result.footerLogo, favicon: result.favicon }));
      toast.success('Logos reset to defaults successfully!', { id: loadingToast });
      await fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset logos', { id: loadingToast });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  // Reusable input style
  const inputCls = "w-full px-3 py-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1.5";

  // Toggle switch component
  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${checked ? 'bg-blue-700' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontSize: '13px' } }} />

      <div className="max-w-9xl mx-auto p-0 sm:p-0 md:p-0 space-y-5 sm:space-y-7">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-950">Settings</h1>
              <p className="text-xs sm:text-sm text-blue-400 font-medium">Configure your CMS settings</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* ── Message banner ── */}
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* ── Mobile tab select ── */}
       <div className="sm:hidden overflow-x-auto">
  <div className="flex gap-2 min-w-max px-1">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => setActiveTab(t.id)}
        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
          ${
            activeTab === t.id
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-blue-900 border border-blue-100"
          }`}
      >
        {t.label}
      </button>
    ))}
  </div>
</div>

        {/* ── Layout: sidebar tabs + content ── */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

          {/* ── Desktop Sidebar Tabs ── */}
          <aside className="hidden sm:flex flex-col gap-1 w-48 shrink-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-blue-900/70 hover:bg-blue-100/60 hover:text-blue-900'
                }`}
              >
                <Icon size={16} className={activeTab === id ? 'text-yellow-300' : 'text-blue-400'} />
                {label}
              </button>
            ))}
          </aside>

          {/* ── Content Panel ── */}
          <div className="flex-1 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">

            {/* Panel header strip */}
            <div className="px-5 sm:px-7 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/80 to-white flex items-center gap-3">
              {(() => {
                const t = tabs.find(t => t.id === activeTab)!;
                const Icon = t.icon;
                return (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
                      <Icon size={15} className="text-yellow-400" />
                    </div>
                    <h2 className="text-sm font-bold text-blue-950">{t.label} Settings</h2>
                  </>
                );
              })()}
            </div>

            <div className="p-5 sm:p-7">

              {/* ════ GENERAL ════ */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={labelCls}>Site Title</label>
                      <input type="text" value={settings.siteTitle} onChange={(e) => handleChange('siteTitle', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Site Description</label>
                      <input type="text" value={settings.siteDescription} onChange={(e) => handleChange('siteDescription', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                        <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone</label>
                      <input type="tel" value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Site URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                        <input type="url" value={settings.siteUrl} onChange={(e) => handleChange('siteUrl', e.target.value)} className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ SECURITY ════ */}
              {activeTab === 'security' && (
                <div className="space-y-3">
                  {[
                    { icon: User, key: 'requireAdminApproval' as const, title: 'Require Admin Approval', desc: 'All new registrations require admin approval' },
                    { icon: Lock, key: 'enable2FA' as const, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to admin accounts' },
                  ].map(({ icon: Icon, key, title, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:border-blue-300 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-950">{title}</p>
                          <p className="text-xs text-blue-400">{desc}</p>
                        </div>
                      </div>
                      <Toggle checked={settings[key] as boolean} onChange={(v) => handleChange(key, v)} />
                    </div>
                  ))}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <label className={labelCls}>Session Timeout (minutes)</label>
                      <input type="number" value={settings.sessionTimeout} onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))} min="5" max="120" className={inputCls} />
                    </div>
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <label className={labelCls}>Max Login Attempts</label>
                      <input type="number" value={settings.maxLoginAttempts} onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))} min="1" max="10" className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* ════ APPEARANCE ════ */}
              {activeTab === 'appearance' && (
                <div className="space-y-7">
                  {/* Colors */}
                  <div>
                    <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-yellow-400 rounded" />
                      Color & Theme
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {[
                        { label: 'Primary Color', key: 'primaryColor' as const },
                        { label: 'Secondary Color', key: 'secondaryColor' as const },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <input type="color" value={settings[key]} onChange={(e) => handleChange(key, e.target.value)} className="w-11 h-11 rounded-xl border-2 border-blue-100 cursor-pointer p-0.5 bg-white" />
                            </div>
                            <input type="text" value={settings[key]} onChange={(e) => handleChange(key, e.target.value)} className={`${inputCls} flex-1 font-mono`} />
                          </div>
                        </div>
                      ))}
                      <div>
                        <label className={labelCls}>Theme</label>
                        <div className="relative">
                          <select value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)} className={`${inputCls} appearance-none`}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto (System Preference)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center justify-between w-full p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-blue-950">Dark Mode Toggle</p>
                            <p className="text-xs text-blue-400">Allow users to switch theme</p>
                          </div>
                          <Toggle checked={settings.enableDarkMode} onChange={(v) => handleChange('enableDarkMode', v)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logos */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-yellow-400 rounded" />
                        Logo Management
                      </h3>
                      <button onClick={handleResetLogos} className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                        <RefreshCw size={12} />
                        Reset Defaults
                      </button>
                    </div>
                    <p className="text-xs text-blue-400 mb-4">Recommended sizes: Navbar (200×50px) · Footer (180×45px) · Favicon (32×32px). Max 2MB for logos, 1MB for favicon.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Navbar Logo */}
                      <div className="rounded-xl border border-blue-100 overflow-hidden hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="px-4 py-3 bg-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-bold text-blue-900">Navbar Logo</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-white/20 text-blue-900 rounded-full">200×50</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="h-24 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden">
                            {settings.navbarLogo ? (
                              <img src={settings.navbarLogo} alt="Navbar" className="max-h-16 max-w-full object-contain" onError={(e) => { e.currentTarget.src = '/images/hously-logo.png'; }} />
                            ) : (
                              <div className="text-center text-blue-300">
                                <Image className="w-7 h-7 mx-auto mb-1" />
                                <p className="text-xs">No logo</p>
                              </div>
                            )}
                          </div>
                          <label className="block">
                            <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadLogo('navbar', f); e.target.value = ''; }} className="hidden" disabled={uploading === 'navbar'} />
                            <div className={`w-full py-2 rounded-xl text-xs font-semibold text-center cursor-pointer transition ${uploading === 'navbar' ? 'bg-gray-100 text-gray-400' : 'bg-blue-800 hover:bg-blue-900 text-white'}`}>
                              {uploading === 'navbar' ? 'Uploading...' : 'Upload Logo'}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Footer Logo */}
                      <div className="rounded-xl border border-blue-100 overflow-hidden hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="px-4 py-3 bg-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-blue-900" />
                            <span className="text-xs font-bold text-blue-900">Footer Logo</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-blue-900/20 text-blue-900 rounded-full">180×45</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="h-24 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden">
                            {settings.footerLogo ? (
                              <img src={settings.footerLogo} alt="Footer" className="max-h-16 max-w-full object-contain" onError={(e) => { e.currentTarget.src = '/images/footer-logo1.png'; }} />
                            ) : (
                              <div className="text-center text-blue-300">
                                <Image className="w-7 h-7 mx-auto mb-1" />
                                <p className="text-xs">No logo</p>
                              </div>
                            )}
                          </div>
                          <label className="block">
                            <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadLogo('footer', f); e.target.value = ''; }} className="hidden" disabled={uploading === 'footer'} />
                            <div className={`w-full py-2 rounded-xl text-xs font-semibold text-center cursor-pointer transition ${uploading === 'footer' ? 'bg-gray-100 text-gray-400' : 'bg-yellow-500 hover:bg-yellow-600 text-blue-900'}`}>
                              {uploading === 'footer' ? 'Uploading...' : 'Upload Logo'}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Favicon */}
                      <div className="rounded-xl border border-blue-100 overflow-hidden hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="px-4 py-3 bg-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-bold text-blue-900">Favicon</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-white/20 text-blue-900 rounded-full">32×32</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="h-24 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden">
                            {settings.favicon ? (
                              <div className="text-center">
                                <img src={settings.favicon} alt="Favicon" className="w-12 h-12 mx-auto object-contain" onError={(e) => { e.currentTarget.src = '/favicon.png'; }} />
                                <p className="text-xs text-blue-400 mt-1.5">Browser tab icon</p>
                              </div>
                            ) : (
                              <div className="text-center text-blue-300">
                                <Image className="w-7 h-7 mx-auto mb-1" />
                                <p className="text-xs">No favicon</p>
                              </div>
                            )}
                          </div>
                          <label className="block">
                            <input type="file" accept=".ico,.png,.jpg,.jpeg" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFavicon(f); e.target.value = ''; }} className="hidden" disabled={uploading === 'favicon'} />
                            <div className={`w-full py-2 rounded-xl text-xs font-semibold text-center cursor-pointer transition ${uploading === 'favicon' ? 'bg-gray-100 text-gray-400' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}>
                              {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <Eye size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700">Changes to logos reflect immediately on your website. The favicon appears in browser tabs and bookmarks.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ NOTIFICATIONS ════ */}
              {activeTab === 'notifications' && (
                <div className="space-y-3">
                  {[
                    { icon: Mail, key: 'emailNotifications' as const, title: 'Email Notifications', desc: 'Receive email alerts for important events' },
                    { icon: Bell, key: 'adminNotifications' as const, title: 'Admin Notifications', desc: 'Send notifications to admin users' },
                    { icon: User, key: 'jobApplicationAlerts' as const, title: 'Job Application Alerts', desc: 'Get notified when someone applies for a job' },
                    { icon: Server, key: 'blogCommentAlerts' as const, title: 'Blog Comment Alerts', desc: 'Receive notifications for new blog comments' },
                  ].map(({ icon: Icon, key, title, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:border-blue-300 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-950">{title}</p>
                          <p className="text-xs text-blue-400">{desc}</p>
                        </div>
                      </div>
                      <Toggle checked={settings[key] as boolean} onChange={(v) => handleChange(key, v)} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Page Footer ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-blue-100">
          <p className="text-xs text-blue-400">Changes will take effect immediately after saving.</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsCMS;