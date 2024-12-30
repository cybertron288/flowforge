"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDrawerStore } from "@/store/drawer-store";
import ScrollArrows from "@/components/ui/scroll-to-buttons";
import { BranchVersionDropdown } from "@/components/flow/workflow-properties/dropdown";
import { SkeletonLoader } from "@/components/flow/workflow-properties/skeleton-loader";

interface FormValues {
    [key: string]: any; // Adjust this type based on your form's data shape
}

export function PropertiesPanel() {
    const { isActionConfigureDrawerOpen, closeActionConfigureDrawer, actionData, workflowVersionsAndBranches, isActionDataLoading } = useDrawerStore();

    const { handleSubmit, control, register, formState: { errors } } = useForm<FormValues>({
        defaultValues: actionData?.actionInputs
            ? Object.keys(actionData.actionInputs).reduce((acc, key) => {
                acc[key] = ""; // Default to empty string or adjust as needed
                return acc;
            }, {} as FormValues)
            : {},
    });

    const onSubmit = (data: FormValues) => {
        console.log("Form submitted with data:", data);
        closeActionConfigureDrawer();
    };

    React.useEffect(() => {
        const scrollContainer = document.querySelector('.shadow-inner-scroll');

        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

                scrollContainer.classList.toggle('scroll-top', scrollTop === 0);
                scrollContainer.classList.toggle('scroll-bottom', scrollTop + clientHeight === scrollHeight);
            });
        }
    }, []);

    return (
        <div className="w-[450px] border-l border-sidebar-border relative h-[calc(100vh_-_58px)] p-2 pb-0 break-words overflow-auto">
            {isActionDataLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <SkeletonLoader />
                </div>
            ) : actionData ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
                    <div className="flex flex-col">
                        <Label className="font-bold text-lg">{actionData?.name}</Label>
                        <Label className="text-sm">Action Properties</Label>
                    </div>

                    <div className="overflow-auto flex-1 px-2 flex flex-col gap-1">
                        <div>
                            <Label className="capitalize" >
                                Select Version or Branch {" "}
                                <span className="text-[#dc2626]">*</span>
                            </Label>
                            <BranchVersionDropdown data={workflowVersionsAndBranches} control={control}
                                name="branchVersion"
                                id="branchVersion" />
                        </div>
                        {Object.keys(actionData?.actionInputs).length > 0 &&
                            Object.keys(actionData?.actionInputs)
                                .map((key: string) => {
                                    const isRequired = actionData.actionInputs[key].required;

                                    return (
                                        <div key={key} className="">
                                            <Label className="capitalize" htmlFor={key}>
                                                {key.replace("_", " ").replace("-", " ")}{" "}
                                                {isRequired && <span className="text-[#dc2626]">*</span>}
                                            </Label>
                                            <Controller
                                                name={key}
                                                control={control}
                                                rules={{ required: isRequired }}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id={key}
                                                        placeholder={`Enter ${key.replace("_", " ").replace("-", " ")}`}
                                                    />
                                                )}
                                            />
                                            {errors[key] && (
                                                <span className="text-[10px] font-semibold text-red-500">This field is required.</span>
                                            )}
                                        </div>
                                    );
                                })}
                    </div>
                    <ScrollArrows />

                    <div className="sticky bottom-0 bg-background py-2 border-t flex justify-end">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-base font-semibold">No action selected.</span>
                </div>
            )}
        </div>
    );
}
