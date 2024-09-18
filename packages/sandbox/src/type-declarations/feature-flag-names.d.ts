export * from "feature-flags";

declare module "feature-flags" {
  export interface DefinedFlagName {
    names: "featureV1" | "featureV2";
  }
}
