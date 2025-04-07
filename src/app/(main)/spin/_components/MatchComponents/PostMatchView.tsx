import { MatchSimRecord, Spin } from "@/types";
import { MillisecondsToTimeString } from "@/utils/FormattingUtils";

export default function PostMatchView({
    time,
    spin,
    simRecords,
}: {
    time: number;
    spin: Spin;
    simRecords: MatchSimRecord[];
}) {
    const timeString = MillisecondsToTimeString(time, false);

    let simRecordsOnMission = simRecords.filter((record) => {
        if (record.mission === spin.mission) {
            return true;
        }
        return false;
    });
    simRecordsOnMission = simRecordsOnMission.sort((a, b) => a.time - b.time);
    const pbTimeString = MillisecondsToTimeString(
        simRecordsOnMission.length > 0 ? simRecordsOnMission[0].time : time,
        false,
    );

    return (
        <>
            <div className="flex-1"></div>
            <div className="flex flex-col">
                <p className="font-mono text-[2em] font-bold">{timeString}</p>
            </div>
            <div className="flex flex-1 flex-col items-center gap-1">
                <div className="flex items-end gap-1">
                    <p className="w-6 text-right font-bold before:content-['PB'] sm:w-32 sm:before:content-['Personal_Best']">
                        {":"}
                    </p>
                    <p className="font-mono">{pbTimeString}</p>
                </div>
            </div>
        </>
    );
}
