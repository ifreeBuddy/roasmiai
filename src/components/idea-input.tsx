import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { AVAILABLE_MODELS, GeminiModelId } from "@/services/roast-service";

interface IdeaInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: (selectedModel: GeminiModelId) => void;
    isLoading: boolean;
    selectedModel: GeminiModelId;
    onSelectModel: (model: GeminiModelId) => void;
}

const EXAMPLE_IDEAS = [
    "An AI alarm clock that charges you if you snooze",
    "Tinder for finding workout partners",
    "A social network for introverts with zero messaging",
];

const LOADING_MESSAGES = [
    "Roasting...",
    "Analyzing weak points...",
    "Consulting honest friend...",
    "Polishing roast verdict...",
];

export function IdeaInput({
    value,
    onChangeText,
    onSubmit,
    isLoading,
    selectedModel,
    onSelectModel,
}: IdeaInputProps) {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingStep((prev) =>
                prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
            );
        }, 2800);

        return () => clearInterval(interval);
    }, [isLoading]);

    const handlePressRoast = () => {
        Keyboard.dismiss();
        setIsDropdownOpen(false);
        setLoadingStep(0);
        if (Platform.OS !== "web") {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } catch {
                // Fallback
            }
        }
        onSubmit(selectedModel);
    };

    const handleSelectExample = (idea: string) => {
        onChangeText(idea);
        setIsDropdownOpen(false);
        if (Platform.OS !== "web") {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {
                // Fallback
            }
        }
    };

    const isSubmitDisabled = !value.trim() || isLoading;

    return (
        <View style={styles.container}>
            {/* Multiline Text Input */}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: isFocused
                            ? theme.inputBorderFocused
                            : theme.inputBorder,
                    },
                ]}
            >
                <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="Describe your idea..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={3}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => {
                        setIsFocused(true);
                        setIsDropdownOpen(false);
                    }}
                    onBlur={() => setIsFocused(false)}
                    editable={!isLoading}
                    maxLength={1000}
                    textAlignVertical="top"
                />

                <View style={styles.inputFooter}>
                    <ThemedText type="caption" themeColor="textMuted">
                        {value.length}/1000
                    </ThemedText>

                    {value.length > 0 && !isLoading && (
                        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
                            <ThemedText
                                type="caption"
                                themeColor="textSecondary"
                            >
                                Clear
                            </ThemedText>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Demo Idea Chips */}
            {!value && !isLoading && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.examplesScroll}
                >
                    {EXAMPLE_IDEAS.map((ex, idx) => (
                        <Pressable
                            key={idx}
                            onPress={() => handleSelectExample(ex)}
                            style={({ pressed }) => [
                                styles.chip,
                                {
                                    backgroundColor: theme.backgroundElement,
                                    borderColor: theme.cardBorder,
                                },
                                pressed && styles.pressed,
                            ]}
                        >
                            <ThemedText
                                style={styles.chipText}
                                themeColor="text"
                                numberOfLines={1}
                            >
                                {ex}
                            </ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {/* Model Dropdown Trigger & Floating Overlay */}
            <View style={styles.modelDropdownContainer}>
                {isDropdownOpen && (
                    <View
                        style={[
                            styles.dropdownMenu,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.cardBorder,
                            },
                        ]}
                    >
                        {AVAILABLE_MODELS.map((m) => {
                            const isSelected = selectedModel === m;
                            return (
                                <Pressable
                                    key={m}
                                    onPress={() => {
                                        onSelectModel(m);
                                        setIsDropdownOpen(false);
                                        if (Platform.OS !== "web") {
                                            try {
                                                Haptics.impactAsync(
                                                    Haptics.ImpactFeedbackStyle
                                                        .Light,
                                                );
                                            } catch {
                                                // Fallback
                                            }
                                        }
                                    }}
                                    style={({ pressed }) => [
                                        styles.dropdownItem,
                                        {
                                            backgroundColor: isSelected
                                                ? theme.primarySurface
                                                : "transparent",
                                        },
                                        pressed && styles.pressed,
                                    ]}
                                >
                                    <ThemedText
                                        type="small"
                                        style={{
                                            color: isSelected
                                                ? theme.primary
                                                : theme.text,
                                            fontWeight: isSelected
                                                ? "700"
                                                : "400",
                                        }}
                                    >
                                        {m}
                                    </ThemedText>
                                    {isSelected && (
                                        <ThemedText
                                            type="smallBold"
                                            style={{ color: theme.primary }}
                                        >
                                            ✓
                                        </ThemedText>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <Pressable
                    disabled={isLoading}
                    onPress={() => {
                        Keyboard.dismiss();
                        setIsDropdownOpen((prev) => !prev);
                    }}
                    style={({ pressed }) => [
                        styles.dropdownTrigger,
                        {
                            backgroundColor: theme.backgroundElement,
                            borderColor: isDropdownOpen
                                ? theme.primary
                                : theme.cardBorder,
                        },
                        pressed && styles.pressed,
                    ]}
                >
                    <View style={styles.triggerLeft}>
                        <ThemedText type="caption" themeColor="textMuted">
                            Model:
                        </ThemedText>
                        <ThemedText
                            type="smallBold"
                            style={{ color: theme.text }}
                        >
                            {selectedModel}
                        </ThemedText>
                    </View>
                    <ThemedText type="smallBold" themeColor="textMuted">
                        {isDropdownOpen ? "▲" : "▼"}
                    </ThemedText>
                </Pressable>
            </View>

            {/* Roast it Button */}
            <Pressable
                onPress={handlePressRoast}
                disabled={isSubmitDisabled}
                style={({ pressed }) => [
                    styles.roastButton,
                    {
                        backgroundColor: isSubmitDisabled
                            ? theme.backgroundSelected
                            : theme.primary,
                    },
                    pressed && !isSubmitDisabled && styles.pressed,
                ]}
            >
                {isLoading ? (
                    <View style={styles.loadingRow}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <ThemedText style={styles.loadingText}>
                            {LOADING_MESSAGES[loadingStep]}
                        </ThemedText>
                    </View>
                ) : (
                    <ThemedText style={styles.buttonText}>Roast it</ThemedText>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: Spacing.one + Spacing.half,
    },
    inputWrapper: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        padding: Spacing.two + Spacing.half,
        minHeight: 100,
        justifyContent: "space-between",
    },
    textInput: {
        fontSize: 15,
        lineHeight: 22,
        minHeight: 64,
    },
    inputFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Spacing.half,
    },
    examplesScroll: {
        gap: Spacing.one,
        paddingVertical: Spacing.half,
    },
    chip: {
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.one,
        borderRadius: BorderRadius.pill,
        borderWidth: 1,
        maxWidth: 320,
    },
    chipText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "500",
    },
    modelDropdownContainer: {
        position: "relative",
        zIndex: 100,
    },
    dropdownTrigger: {
        height: 40,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.three,
    },
    triggerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.one,
    },
    dropdownMenu: {
        position: "absolute",
        bottom: 44,
        left: 0,
        right: 0,
        zIndex: 999,
        elevation: 8,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.two,
    },
    roastButton: {
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.two,
    },
    loadingText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
    pressed: {
        opacity: 0.8,
    },
});
