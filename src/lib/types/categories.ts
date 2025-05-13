import type { Articles } from './article';
import type { Watches } from './watches';


export enum Category {
    ANALOG = "ANALOG",
    ANALOG_DIGITAL = "ANALOG_DIGITAL",
    QUARTZ = "QUARTZ",
    AUTOMATIC = "AUTOMATIC",
    DIGITAL = "DIGITAL",
    CHRONOGRAPH = "CHRONOGRAPH",
    SMARTWATCH = "SMARTWATCH",
    HYBRID = "HYBRID",
    LUXURY = "LUXURY",
    DIVER = "DIVER",
    PILOT = "PILOT",
    POCKET = "POCKET",
    STRAPS = "STRAPS",
    DRESS = "DRESS",
    FIELD = "FIELD",
    TOURBILLON = "TOURBILLON",
    MECHANICAL = "MECHANICAL",
    SOLAR = "SOLAR",
    SKELETON = "SKELETON",
    OTHER = "OTHER",
}

export type Categories = {
    id: number;
    type: Category;
    name: string;
    Articles: Articles[];
    watches: Watches[];
};

