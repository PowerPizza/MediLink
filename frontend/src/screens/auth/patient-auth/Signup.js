import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import TextTypeInput from "../../../components/auth-entries/TextTypeInput";
import PasswordTypeInput from "../../../components/auth-entries/PasswordTypeInput";
import NumericTypeInput from "../../../components/auth-entries/NumericTypeInput";
import DividerWithLabel from "../../../components/DividerWithLabel";
import SubmitButton from "../../../components/SubmitButton";
import { COMMON_STYLES } from "../../../commons/common-styles";
import { COLORS } from "../../../colors/colors";
import { createVerificationCode } from "../../../utils/helper-functions";
import apiClient from "../../../utils/api-client";
import Toast from "react-native-toast-message";
import AppContext from "../../../contexts/AppContext";
import { AsyncStorageDriver } from "../../../data/AsyncStorageDriver";
import { CommonActions, useNavigation } from "@react-navigation/native";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Others" },
];

const generatePatientId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default function SignupScreen() {
  const [formStage, setFormStage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [codeSentCooldown, setCodeSentCooldown] = useState(30);
  const [cooldownInterval, setCooldownInterval] = useState(null);
  const actualVerificationCode = useRef(null);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [phoneNo, setPhoneNo] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [patientId, setPatientId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [isGmailVerified, setIsGmailVerified] = useState(false);
  const [isGmailAvailable, setIsGmailAvailable] = useState(true);
  const [isInvalidCode, setIsInvalidCode] = useState(false);

  const sharedData = useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!patientId) {
      setPatientId(generatePatientId());
    }
  }, [patientId]);

  useEffect(() => {
    return () => {
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
      }
    };
  }, [cooldownInterval]);

  const startCodeCooldown = () => {
    if (cooldownInterval) return;

    const interval = setInterval(() => {
      setCodeSentCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCooldownInterval(null);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    setCooldownInterval(interval);
  };

  const setGmailValue = (value) => {
    if (isGmailVerified) {
      setIsGmailVerified(false);
      setVerificationCode("");
      actualVerificationCode.current = null;
    }
    setGmail(value);
  };

  const verifyGmailExistance = async () => {
    if (!gmail || !gmail.endsWith("@gmail.com")) {
      setIsGmailAvailable(true);
      return false;
    }

    try {
      const exists = await apiClient.checkGmailExists(gmail, "patient");
      if (exists) {
        Toast.show({ text2: "Gmail already exists", type: "error" });
      }
      setIsGmailAvailable(!exists);
      return exists;
    } catch (error) {
      Toast.show({ text2: "Unable to verify gmail availability", type: "error" });
      return false;
    }
  };

  const sendVerificationCode = async () => {
    if (cooldownInterval) return;
    if (!gmail || !gmail.endsWith("@gmail.com")) {
      Toast.show({ text2: "Enter a valid gmail address first.", type: "error" });
      return;
    }

    actualVerificationCode.current = createVerificationCode();

    try {
      const resp = await apiClient.sendVerificationCode(gmail, actualVerificationCode.current);
      if (resp.status === 200) {
        Toast.show({ text2: `Verification code sent to ${gmail}`, type: "success" });
        startCodeCooldown();
      }
    } catch (error) {
      console.log("Verification code send failed", error);
      Toast.show({ text2: "Could not send verification code", type: "error" });
    }
  };

  const captureUserVerificationCode = (code) => {
    const cleaned = code.replace(/[^0-9-]/g, "");
    let formatted = cleaned;

    if (cleaned.length === 3 && !cleaned.endsWith("-")) {
      formatted = `${cleaned}-`;
    }

    setVerificationCode(formatted);
    setIsInvalidCode(false);

    if (formatted.length === 7) {
      if (formatted === actualVerificationCode.current) {
        setIsGmailVerified(true);
        setIsInvalidCode(false);
      } else {
        setIsGmailVerified(false);
        setIsInvalidCode(true);
      }
    }
  };

  const handleProceedToStage2 = async () => {
    setIsProcessing(true);

    if (!fullName.trim() || !age.trim() || !phoneNo.trim() || !gmail.trim() || !password.trim()) {
      Toast.show({ text2: "All fields are required", type: "error" });
      setIsProcessing(false);
      return;
    }

    if (!/^[1-9][0-9]*$/.test(age)) {
      Toast.show({ text2: "Enter a valid age", type: "error" });
      setIsProcessing(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNo)) {
      Toast.show({ text2: "Enter a valid 10-digit phone number", type: "error" });
      setIsProcessing(false);
      return;
    }

    if (!gmail.endsWith("@gmail.com")) {
      Toast.show({ text2: "Gmail is required and must end with @gmail.com", type: "error" });
      setIsProcessing(false);
      return;
    }

    const exists = await verifyGmailExistance();
    if (exists) {
      setIsProcessing(false);
      return;
    }

    setFormStage(2);
    setIsProcessing(false);

    if (!isGmailVerified) {
      await sendVerificationCode();
    }
  };

  const handleFinishSignup = async () => {
    if (!isGmailVerified) {
      Toast.show({ text2: "Please verify your email before creating your patient account", type: "error" });
      return;
    }

    setIsProcessing(true);
    const form_data = {
      full_name: fullName.trim(),
      age: Number(age),
      gender,
      phone_no: phoneNo.trim(),
      gmail: gmail.trim().toLowerCase(),
      password,
      patient_id: patientId,
      verification_code: verificationCode.trim(),
        pfp_url: "",
        is_active: true,
    };

    console.log("Patient signup data:", form_data);

    await createPatient(form_data);
    setIsProcessing(false);
  };

  const createPatient = async (data) => {
    sharedData.showLoadingModal(true);
    const response = await apiClient.signupPatient(data);
    if (response.status === 200) {
        sharedData.showLoadingModal(false);
        console.log(navigation?.getParent()?.getState()?.routeNames);
        await AsyncStorageDriver.setItem("jwt", response.data?.token || "");
        Toast.show({ text2: "Patient account created successfully", type: "success" });
        console.log(navigation?.getParent()?.getState()?.routeNames);
        try {
          navigation.getParent()?.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: "patientNavs"}],
            })
          );
        }
        catch (exc) {
          console.log("error whikle nv:", exc);
        }
    } else {
      Toast.show({ text2: "Failed to create patient account", type: "error" });
    }
    sharedData.showLoadingModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 60}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stagePreviewContainer}>
          <TouchableOpacity
            onPress={() => setFormStage(1)}
            style={[styles.stageLabelHolder, formStage === 1 ? styles.stageActive : styles.stageInactive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.stageLabel, formStage === 1 ? styles.stageLabelActive : styles.stageLabelInactive]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => formStage === 2 && setFormStage(2)}
            style={[styles.stageLabelHolder, formStage === 2 ? styles.stageActive : styles.stageInactive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.stageLabel, formStage === 2 ? styles.stageLabelActive : styles.stageLabelInactive]}>2</Text>
          </TouchableOpacity>
        </View>

        {formStage === 1 ? (
          <>
            <DividerWithLabel label="Basic info" />
            <TextTypeInput iconName="user" placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <NumericTypeInput iconName="calendar" placeholder="Age" value={age} onChangeText={setAge} />

            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value ? styles.genderOptionSelected : {},
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setGender(option.value)}
                >
                  <Text
                    style={
                      gender === option.value
                        ? styles.genderLabelSelected
                        : styles.genderLabel
                    }
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextTypeInput iconName="phone" placeholder="Phone Number" value={phoneNo} onChangeText={setPhoneNo} keyboardType="phone-pad" />
            <TextTypeInput iconName="envelope" placeholder="Gmail" value={gmail} isValid={isGmailAvailable} onChangeText={setGmailValue} onBlur={verifyGmailExistance} autoCapitalize="none" keyboardType="email-address" />
            <PasswordTypeInput placeholder="Password" value={password} onChangeText={setPassword} />

            <Text style={[COMMON_STYLES.tooltipTextSmall, styles.patientIdLabel]}>Patient ID (auto-generated)</Text>
            <TextTypeInput
              iconName="id-card-o"
              value={patientId}
              editable={false}
              style={styles.patientIdInput}
            />

            <SubmitButton title="Continue" onPress={handleProceedToStage2} loading={isProcessing} style={{ marginTop: 8 }} />
          </>
        ) : null}

        {formStage === 2 ? (
          <>
            <DividerWithLabel label="Verify email" />
            <View style={styles.gmailCard}>
              <FontAwesome name="envelope-o" color={COLORS.darkGreen} size={22} style={styles.gmailCardIcon} />
              <View style={{ flex: 1 }}>
                <Text style={[COMMON_STYLES.tooltipTextMid, { fontWeight: "bold" }]}>Gmail</Text>
                <Text style={{ fontSize: 16, fontWeight: "700" }}>{gmail}</Text>
              </View>
              <View style={[styles.gmailStatusBadge, isGmailVerified ? styles.gmailStatusVerified : styles.gmailStatusPending]}>
                <FontAwesome name={isGmailVerified ? "check" : "warning"} size={16} color={isGmailVerified ? COLORS.darkGreen : COLORS.gold} />
                <Text style={[styles.gmailStatusText, isGmailVerified ? styles.gmailStatusTextVerified : styles.gmailStatusTextPending]}>
                  {isGmailVerified ? "Verified" : "Not verified"}
                </Text>
              </View>
            </View>

            {!isGmailVerified ? (
              <>
                <Text style={COMMON_STYLES.tooltipTextMid}>
                  A verification code has been sent to your gmail. Enter the code to continue.
                </Text>
                <Text style={COMMON_STYLES.tooltipTextMid}>
                  If you do not receive it, check spam or press resend.
                </Text>

                <View style={styles.codeResendGroup}>
                  <TextTypeInput
                    placeholder="000-000"
                    value={verificationCode}
                    onChangeText={captureUserVerificationCode}
                    style={[styles.codeInput, isInvalidCode ? styles.invalidCodeInput : {}]}
                    maxLength={7}
                    keyboardType="numeric"
                  />
                  {cooldownInterval ? (
                    <Text style={COMMON_STYLES.tooltipTextLarge}>
                      Resend in <Text style={{ fontWeight: "bold" }}>00:{String(codeSentCooldown).padStart(2, "0")}</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={sendVerificationCode} activeOpacity={0.7}>
                      <Text style={COMMON_STYLES.tooltipTextLarge}>Resend code</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            ) : null}

            <View style={{ marginTop: 16 }}>
              <SubmitButton
                title="Create patient"
                onPress={handleFinishSignup}
                disabled={!isGmailVerified}
                loading={isProcessing}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
    gap: 10,
  },
  stagePreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  stageLabelHolder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  stageActive: {
    backgroundColor: COLORS.lightGreen,
    borderColor: COLORS.darkGreen,
  },
  stageInactive: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.gray,
  },
  stageLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stageLabelActive: {
    color: COLORS.darkGreen,
  },
  stageLabelInactive: {
    color: COLORS.gray,
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  genderOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  genderOptionSelected: {
    borderColor: COLORS.darkGreen,
    backgroundColor: COLORS.lightGreen,
  },
  genderLabel: {
    color: COLORS.gray,
    fontWeight: "600",
  },
  genderLabelSelected: {
    color: COLORS.darkGreen,
    fontWeight: "700",
  },
  patientIdLabel: {
    marginTop: 10,
    marginBottom: 4,
  },
  patientIdInput: {
    opacity: 0.7,
  },
  gmailCard: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  gmailCardIcon: {
    padding: 6,
    backgroundColor: COLORS.lightGreen2,
    borderRadius: 12,
  },
  gmailStatusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 6,
  },
  gmailStatusVerified: {
    backgroundColor: COLORS.lightGreen,
  },
  gmailStatusPending: {
    backgroundColor: COLORS.lightGold,
  },
  gmailStatusText: {
    fontSize: 12,
  },
  gmailStatusTextVerified: {
    color: COLORS.darkGreen,
  },
  gmailStatusTextPending: {
    color: COLORS.gold,
  },
  codeResendGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  codeInput: {
    width: 110,
  },
  invalidCodeInput: {
    borderColor: COLORS.lightRed,
  },
});