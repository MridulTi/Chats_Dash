import { WiDayCloudy, WiDaySunny, WiDust, WiFog, WiRain, WiSnow, WiSprinkle } from "react-icons/wi";


export const WeatherCard = ({ date, tempMax, units, tempMin, apparentTempMax, apparentTempMin, rain, weatherCode }) => {
    return (
        <div className="border p-3 sm:p-4 m-2 rounded-2xl shadow-lg bg-white w-44 sm:w-52 lg:w-60 grid place-items-center aspect-square">
            <h2 className="font-bold text-base sm:text-lg md:text-xl">{date}</h2>
            <img className=""
                src={weatherIcons[weatherCode.toString()].day.image}
            />
            <div className="grid place-items-center gap-1 sm:gap-2">
                <div className="flex gap-2 sm:gap-4">
                    {tempMax && (
                        <p className="text-xs sm:text-sm font-semibold">
                            {tempMax}{units.temperature_2m_max}
                        </p>
                    )}
                    {tempMin && (
                        <p className="text-xs sm:text-sm text-cyan-500">
                            {tempMin}{units.temperature_2m_min}
                        </p>
                    )}
                </div>
                <div className="text-xs sm:text-sm flex gap-1 sm:gap-2">
                    <b className="text-gray-500">Apparent:</b>
                    {apparentTempMax && (
                        <p className="text-orange-300">
                            {apparentTempMax}{units.apparent_temperature_max}
                        </p>
                    )}
                    {apparentTempMin && (
                        <p className="text-cyan-400">
                            {apparentTempMin}{units.apparent_temperature_min}
                        </p>
                    )}
                </div>
                {rain != 0 && (
                    <p className="text-xs sm:text-sm">
                        <b>Rain:</b> {rain}{units.rain_sum}
                    </p>
                )}
            </div>
        </div>

    );
};

export const WholeCard = ({ title,imageSrc, icon, value, units }) => {
    return (
        <div className="bg-white grid place-items-start p-4 sm:p-6 md:p-8 rounded-2xl shadow-md gap-4 sm:gap-6">
            <h2 className="text-sm sm:text-md md:text-lg text-gray-500">{title}</h2>
            {icon&&<div className="text-xl sm:text-3xl md:text-4xl">
                {icon}
            </div>}
            {imageSrc&&<img className=""
                src={imageSrc}
            />}
            <div className="flex gap-1 sm:gap-2 place-items-end">
                <p className="text-4xl sm:text-5xl md:text-6xl">{value}</p>
                <p className="text-md sm:text-lg md:text-xl">{units}</p>
            </div>
        </div>

    )
}

export const LongCard=(props)=>{
    return(
        <div className="bg-white rounded-2xl w-4/6 p-5 px-10">
            <h1 className="font-semibold text-lg">{props.title}</h1>
            <h1 className="text-3xl font-extrabold ">{props.amount}</h1>
            {props.subtitle&&<p className="pt-6 text-gray-700 text-sm">{props.subtitle}</p>}
        </div>
    )
}

export function MetricsCard({ metrics }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-full mx-auto my-4">
            <h2 className="font-extrabold text-2xl mb-4 text-center">Metrics Overview</h2>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 object-contain">
                <div className="m-2 flex break-inside-avoid bg-red-100 p-5 rounded-xl justify-between">
                    <span className="font-semibold">Average Duration:</span>
                    <span>{metrics.averageDuration || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-green-100 p-5 rounded-xl justify-between">
                    <span className="font-semibold">Common Region:</span>
                    <span>{metrics.commonRegion || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-blue-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Dominant PESTLE:</span>
                    <span>{metrics.dominantPESTLE || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-orange-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Frequent Topic:</span>
                    <span>{metrics.frequentTopic || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-purple-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Highest Intensity:</span>
                    <span>{metrics.highestIntensity || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-orange-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Leading Sector:</span>
                    <span>{metrics.leadingSector || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-red-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Lowest Impact:</span>
                    <span>{metrics.lowestImpact || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-green-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Max Likelihood:</span>
                    <span>{metrics.maxLikelihood || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-blue-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Min Relevance:</span>
                    <span>{metrics.minRelevance || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid flex-col bg-orange-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Oldest Entry:</span>
                    <span>{metrics.oldestEntry || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid bg-purple-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Peak Year:</span>
                    <span>{metrics.peakYear || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid flex-col bg-red-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Popular URL:</span>
                    <span>
                        <a href={metrics.popularURL} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {metrics.popularURL || "N/A"}
                        </a>
                    </span>
                </div>
                <div className="m-2 flex flex-col break-inside-avoid bg-blue-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Recent Insight:</span>
                    <span>{metrics.recentInsight || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid flex-col bg-green-100 p-5 rounded-xl  justify-between">
                    <span className="font-semibold">Strong Insight:</span>
                    <span>{metrics.strongInsight || "N/A"}</span>
                </div>
                <div className="m-2 flex break-inside-avoid  bg-orange-100 p-5 rounded-xl justify-between">
                    <span className="font-semibold">Top Source:</span>
                    <span>{metrics.topSource || "N/A"}</span>
                </div>
            </div>
        </div>
    );
}

