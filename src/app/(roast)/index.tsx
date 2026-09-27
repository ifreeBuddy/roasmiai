import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IdeaInput } from "@/components/idea-input";
import { RoastHeader } from "@/components/roast-header";
import { RoastOutput } from "@/components/roast-output";
import { RoastPlaceholder } from "@/components/roast-placeholder";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { GeminiModelId, roastMyIdea } from "@/services/roast-service";

export default function RoastScreen() {
    const insets = useSafeAreaInsets();

    const [idea, setIdea] = useState("");
    const [selectedModel, setSelectedModel] = useState<GeminiModelId>(
        "gemini-flash-latest",
    );
    const [isLoading, setIsLoading] = useState(false);
    const [critiquePoints, setCritiquePoints] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modelUsed, setModelUsed] = useState<string | undefined>(undefined);

    const handleRoast = async (model: GeminiModelId = selectedModel) => {
        if (!idea.trim() || isLoading) return;

        Keyboard.dismiss();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await roastMyIdea(idea, model);
            setCritiquePoints(result.points);
            setModelUsed(result.modelUsed);
        } catch (err: any) {
            console.warn("Roast request error:", err);
            const msg =
                err?.message || "Could not complete roast. Please try again.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const hasCritiqueOrError =
        critiquePoints.length > 0 || Boolean(errorMessage);

    return (
        <ThemedView style={styles.screenContainer}>
            <View
                style={[
                    styles.safeContainer,
                    {
                        paddingTop: insets.top,
                        paddingBottom: Math.max(insets.bottom, Spacing.two),
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                    },
                ]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={
                        Platform.OS === "ios" ? insets.top + 8 : 0
                    }
                    style={styles.keyboardAvoider}
                >
                    <View style={styles.centeredWrapper}>
                        {/* 1. Header (Pinned Top) */}
                        <RoastHeader />

                        {/* 2. Middle Content Area */}
                        <ScrollView
                            style={styles.middleScrollView}
                            contentContainerStyle={styles.middleScrollContent}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                            showsVerticalScrollIndicator={false}
                        >
                            {hasCritiqueOrError ? (
                                <RoastOutput
                                    points={critiquePoints}
                                    error={errorMessage}
                                    onRetry={() => handleRoast(selectedModel)}
                                    modelUsed={modelUsed}
                                />
                            ) : (
                                <RoastPlaceholder />
                            )}
                        </ScrollView>

                        {/* 3. Bottom Input Bar */}
                        <View style={styles.bottomDock}>
                            <IdeaInput
                                value={idea}
                                onChangeText={(text) => {
                                    setIdea(text);
                                    if (errorMessage) setErrorMessage(null);
                                }}
                                onSubmit={handleRoast}
                                isLoading={isLoading}
                                selectedModel={selectedModel}
                                onSelectModel={setSelectedModel}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    safeContainer: {
        flex: 1,
    },
    keyboardAvoider: {
        flex: 1,
    },
    centeredWrapper: {
        flex: 1,
        width: "100%",
        maxWidth: MaxContentWidth,
        alignSelf: "center",
        paddingHorizontal: Spacing.four,
        justifyContent: "space-between",
    },
    middleScrollView: {
        flex: 1,
    },
    middleScrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: Spacing.two,
    },
    bottomDock: {
        paddingTop: Spacing.one,
        paddingBottom: Spacing.one,
    },
});
