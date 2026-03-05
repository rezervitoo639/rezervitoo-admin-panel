import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconWorld,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconEye,
  IconEyeOff,
  IconPencil,
} from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../api/settings.api";
import { notifications } from "../../utils/notifications";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader/Loader";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "support" | "system">(
    "profile",
  );
  const [language, setLanguage] = useState(i18n.language || "en");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  // Helper to get full PFP URL
  const getPfpUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
    const baseUrl = apiBase.includes("/api")
      ? apiBase.split("/api")[0]
      : apiBase;
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Profile state
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [pfp, setPfp] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string | null>(
    getPfpUrl(user?.pfp),
  );
  const [showPassword, setShowPassword] = useState(false);

  // Support contact state
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Fetch support contact info
  const { data: supportContact, isLoading: loadingSupport } = useQuery({
    queryKey: ["support-contact"],
    queryFn: settingsApi.getSupportContact,
  });

  // Update support contact when data loads
  useEffect(() => {
    if (supportContact) {
      setWhatsappPhone(supportContact.whatsapp_phone || "");
      setFacebook(supportContact.facebook || "");
      setInstagram(supportContact.instagram || "");
      setLinkedin(supportContact.linkedin || "");
    }
  }, [supportContact]);

  // Update pfp preview when user changes
  useEffect(() => {
    if (user?.pfp) {
      setPfpPreview(getPfpUrl(user.pfp));
    }
  }, [user]);

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => settingsApi.updateProfile(user!.id, data),
    onSuccess: () => {
      notifications.show({
        title: t("common.success"),
        message: t("settings.profile.updateSuccess"),
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setPassword(""); // Clear password field
    },
    onError: () => {
      notifications.show({
        title: t("common.error"),
        message: t("settings.profile.updateError"),
        color: "red",
      });
    },
  });

  // Update support contact mutation
  const updateSupportMutation = useMutation({
    mutationFn: (data: any) => settingsApi.updateSupportContact(data),
    onSuccess: () => {
      notifications.show({
        title: t("common.success"),
        message: t("settings.support.updateSuccess"),
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["support-contact"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.whatsapp_phone?.[0] ||
        t("settings.support.updateError");
      notifications.show({
        title: t("common.error"),
        message: errorMessage,
        color: "red",
      });
    },
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLanguageChange = (newCode: string) => {
    setLanguage(newCode);
    i18n.changeLanguage(newCode);
    document.dir = newCode === "ar" ? "rtl" : "ltr";

    // Update URL to reflect language change
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/");
    // Replace language segment (first segment after /)
    if (pathSegments.length > 1) {
      pathSegments[1] = newCode;
      navigate(pathSegments.join("/"), { replace: true });
    }
  };

  const handleSaveProfile = () => {
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    if (pfp) {
      formData.append("pfp", pfp);
    }
    updateProfileMutation.mutate(formData);
    setPassword(""); // Clear password field
    setPfp(null); // Clear pfp file
  };

  const handleSaveSupport = () => {
    // Validate WhatsApp phone
    const digitsOnly = whatsappPhone.replace(/\D/g, "");
    if (whatsappPhone && digitsOnly.length !== 10) {
      notifications.show({
        title: t("common.error"),
        message: t("settings.support.whatsappError"),
        color: "red",
      });
      return;
    }

    updateSupportMutation.mutate({
      whatsapp_phone: digitsOnly || null,
      facebook: facebook || null,
      instagram: instagram || null,
      linkedin: linkedin || null,
    });
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("settings.pageTitle")}</h1>
        <p className={styles.subtitle}>{t("settings.pageSubtitle")}</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "profile" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <IconUser size={20} />
          {t("settings.tabs.profile")}
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "support" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("support")}
        >
          <IconPhone size={20} />
          {t("settings.tabs.support")}
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "system" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("system")}
        >
          <IconWorld size={20} />
          {t("settings.tabs.system")}
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "profile" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("settings.tabs.profile")}
            </h2>
            <p className={styles.sectionDescription}>
              {t("settings.profile.description")}
            </p>

            <div className={styles.formGrid}>
              <div className={styles.formGroupFullWidth}>
                <label className={styles.label}>
                  {t("settings.profile.pfp")}
                </label>
                <div className={styles.pfpContainer}>
                  <div className={styles.avatarCircle}>
                    {pfpPreview ? (
                      <img
                        src={pfpPreview}
                        alt="Profile"
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user?.first_name?.[0] || "A"}
                        {user?.last_name?.[0] || "D"}
                      </div>
                    )}
                    <label className={styles.editIconButton}>
                      <IconPencil size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPfp(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPfpPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t("settings.profile.firstName")}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t("settings.profile.lastName")}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className={styles.formGroupFullWidth}>
                <label className={styles.label}>
                  {t("settings.profile.email")}
                </label>
                <div className={styles.inputWithIcon}>
                  <IconMail size={20} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroupFullWidth}>
                <label className={styles.label}>
                  {t("settings.profile.newPassword")}
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.passwordInput}
                    placeholder={t("settings.profile.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IconEyeOff size={20} />
                    ) : (
                      <IconEye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              className={styles.saveButton}
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending
                ? t("common.saving")
                : t("settings.profile.save")}
            </button>
          </div>
        )}

        {activeTab === "support" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("settings.tabs.support")}
            </h2>
            <p className={styles.sectionDescription}>
              {t("settings.support.description")}
            </p>

            {loadingSupport ? (
              <Loader />
            ) : (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formGroupFullWidth}>
                    <label className={styles.label}>
                      {t("settings.support.whatsapp")}
                    </label>
                    <div className={styles.inputWithIcon}>
                      <IconBrandWhatsapp
                        size={20}
                        className={styles.inputIcon}
                      />
                      <input
                        type="tel"
                        className={styles.input}
                        placeholder={t("settings.support.whatsappHelper")}
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      {t("settings.support.facebook")}
                    </label>
                    <div className={styles.inputWithIcon}>
                      <IconBrandFacebook
                        size={20}
                        className={styles.inputIcon}
                      />
                      <input
                        type="url"
                        className={styles.input}
                        placeholder="https://facebook.com/rizervitoo"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      {t("settings.support.instagram")}
                    </label>
                    <div className={styles.inputWithIcon}>
                      <IconBrandInstagram
                        size={20}
                        className={styles.inputIcon}
                      />
                      <input
                        type="url"
                        className={styles.input}
                        placeholder="https://instagram.com/rizervitoo"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      {t("settings.support.linkedin")}
                    </label>
                    <div className={styles.inputWithIcon}>
                      <IconBrandLinkedin
                        size={20}
                        className={styles.inputIcon}
                      />
                      <input
                        type="url"
                        className={styles.input}
                        placeholder="https://linkedin.com/company/rizervitoo"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className={styles.saveButton}
                  onClick={handleSaveSupport}
                  disabled={updateSupportMutation.isPending}
                >
                  {updateSupportMutation.isPending
                    ? t("common.saving")
                    : t("settings.support.save")}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "system" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("settings.tabs.system")}</h2>

            <div className={styles.systemContainer}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {t("settings.system.theme")}
                </label>
                <div className={styles.themeSelection}>
                  {/* Light Theme Card */}
                  <div
                    className={`${styles.themeCard} ${theme === "light" ? styles.active : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <div
                      className={`${styles.themePreview} ${styles.themePreviewLight}`}
                    >
                      <div
                        className={`${styles.windowHeader} ${styles.lightHeader}`}
                      >
                        <div
                          className={`${styles.windowDot} ${styles.dotRed}`}
                        ></div>
                        <div
                          className={`${styles.windowDot} ${styles.dotYellow}`}
                        ></div>
                        <div
                          className={`${styles.windowDot} ${styles.dotGreen}`}
                        ></div>
                      </div>
                      <div className={styles.windowBody}>
                        <div
                          className={`${styles.windowSidebar} ${styles.lightSidebar}`}
                        ></div>
                        <div className={styles.windowContent}>
                          <div
                            className={`${styles.contentLine} ${styles.lightLine}`}
                          ></div>
                          <div
                            className={`${styles.contentLine} ${styles.lightLine}`}
                          ></div>
                          <div
                            className={`${styles.contentLine} ${styles.lightLine}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className={styles.themeLabel}>
                      {t("settings.system.light")}
                    </span>
                  </div>

                  {/* Dark Theme Card */}
                  <div
                    className={`${styles.themeCard} ${theme === "dark" ? styles.active : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <div
                      className={`${styles.themePreview} ${styles.themePreviewDark}`}
                    >
                      <div
                        className={`${styles.windowHeader} ${styles.darkHeader}`}
                      >
                        <div
                          className={`${styles.windowDot} ${styles.dotRed}`}
                        ></div>
                        <div
                          className={`${styles.windowDot} ${styles.dotYellow}`}
                        ></div>
                        <div
                          className={`${styles.windowDot} ${styles.dotGreen}`}
                        ></div>
                      </div>
                      <div className={styles.windowBody}>
                        <div
                          className={`${styles.windowSidebar} ${styles.darkSidebar}`}
                        ></div>
                        <div className={styles.windowContent}>
                          <div
                            className={`${styles.contentLine} ${styles.darkLine}`}
                          ></div>
                          <div
                            className={`${styles.contentLine} ${styles.darkLine}`}
                          ></div>
                          <div
                            className={`${styles.contentLine} ${styles.darkLine}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className={styles.themeLabel}>
                      {t("settings.system.dark")}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.languageSection}>
                <label className={styles.label}>
                  {t("settings.system.language")}
                </label>
                <div className={styles.languageGrid}>
                  <button
                    className={`${styles.languageButton} ${language === "en" ? styles.active : ""}`}
                    onClick={() => handleLanguageChange("en")}
                  >
                    <img
                      src="/src/assets/languages/England.png"
                      alt="English"
                      className={styles.flagImage}
                    />
                    <span className={styles.languageName}>English</span>
                  </button>

                  <button
                    className={`${styles.languageButton} ${language === "fr" ? styles.active : ""}`}
                    onClick={() => handleLanguageChange("fr")}
                  >
                    <img
                      src="/src/assets/languages/France.png"
                      alt="Français"
                      className={styles.flagImage}
                    />
                    <span className={styles.languageName}>Français</span>
                  </button>

                  <button
                    className={`${styles.languageButton} ${language === "ar" ? styles.active : ""}`}
                    onClick={() => handleLanguageChange("ar")}
                  >
                    <img
                      src="/src/assets/languages/Algeria.png"
                      alt="العربية"
                      className={styles.flagImage}
                    />
                    <span className={styles.languageName}>العربية</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
