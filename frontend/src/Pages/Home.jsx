import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LongCard} from '../Components/Cards';
import { useAuth } from '../Context/Context';
import { useError } from '../Context/ErrorContext';
import { BarChart, DoughnutChart, LineChart, PieChart } from '../Components/Charts';
import ErrorModal from '../Components/ErrorModal';

function Home() {
  const { userDetails } = useAuth();
  const { triggerError } = useError();
  const [details, setDetails] = useState(null);
  const [chartData, setChartData] = useState({
    Bar: { labels: [], datasets: [] },
    Doughnut: { labels: [], datasets: [] },
    Line: { labels: [], datasets: [] },
  });

  useEffect(() => {
    axios.get("/api/v1/visualize/basic-details")
      .then(res => {
        const impactedData = res.data.data?.mostImpactedOrHighlyLikehood_serialized;

        if (impactedData) {
          const likelihoodLabels = impactedData.map(data => data.likelihood || "Unknown Likelihood");
          const impactLabels = impactedData.map(data => data.impact || "Unknown Impact");
          const countryData = impactedData.map(data => data.country || 0);

          setChartData({
            Bar: {
              labels: countryData,
              datasets: [
                {
                  label: "Countries Impacted Based on Likelihood",
                  data: likelihoodLabels,
                  borderWidth: 2,
                  backgroundColor: "cyan"
                },
                {
                  label: "Impacts on Countries",
                  data: impactLabels,
                  borderWidth: 2,
                  backgroundColor: "indigo"
                },
              ],
            },
            Doughnut: {
              labels: res.data.data?.topic_Count.map(data => data.topic),
              datasets: [
                {
                  label: "Topic Count",
                  data: res.data.data?.topic_Count.map(data => data.count)
                }
              ]
            },
            Line: {
              labels: res.data.data?.yearly_insights.map(data => data.year),
              datasets: [
                {
                  label: "Yearly Impact",
                  data: res.data.data?.yearly_insights.map(data => data.avg_impact),
                },
                {
                  label: "Yearly Likelihood",
                  data: res.data.data?.yearly_insights.map(data => data.avg_likelihood),
                },
                {
                  label: "Yearly Intensity",
                  data: res.data.data?.yearly_insights.map(data => data.avg_intensity),
                }
              ]
            }
          });
        }

        setDetails(res.data.data);
      })
      .catch(err => {
        triggerError(err)
      });
  }, []);

  return (
    <div className="w-full lg:min-w-10/12 bg-indigo-50 min-h-screen lg:ml-72 px-4 md:px-6 lg:px-5 py-5">
      <h1 className="font-extrabold text-2xl md:text-4xl">Hello, {userDetails?.firstName} Welcome Back!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full lg:w-10/12 justify-center items-start mt-4">
        {/* Left Side (Cards and Bar/Line Charts) */}
        <div className="grid gap-4 place-items-center w-full">
          {/* Cards */}
          <div className="flex gap-2 md:gap-4 justify-center">
            {details && <LongCard title="Total Records" amount={details?.totalRecords} />}
            {details && <LongCard title="Highest Relevance" amount={details?.highest_Relevance} />}
            {details && <LongCard title="Highest Intensity" amount={details?.highest_intensity} />}
            {details && <LongCard title="Highest Likelihood" amount={details?.highest_likelihood} />}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl w-full h-fit p-6">
            {chartData?.Bar?.labels?.length > 0 && chartData.Bar.datasets.length > 0 ? (
              <BarChart chartData={chartData.Bar} />
            ) : (
              <p>Loading chart data...</p>  // Optionally, show a loading message
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl w-full p-5 h-fit grid place-items-center">
            <h1 className="font-extrabold text-xl text-center">YEARLY INSIGHTS.</h1>
            <LineChart chartData={chartData.Line} />
          </div>
        </div>

        {/* Right Side (Doughnut Chart and Sector Information) */}
        <div className="grid gap-4 items-start w-full h-full">
          {/* Doughnut Chart */}
          <div className="bg-white rounded-xl w-full h-fit p-5 px-10">
            <h1 className="font-extrabold text-xl text-center">RELEVANCE OF TOPICS.</h1>
            <DoughnutChart chartData={chartData.Doughnut} />
          </div>

          {/* Sector Data */}
          <div className="bg-white rounded-xl w-full p-5 h-fit grid place-items-center">
            <h1 className="font-extrabold text-xl text-center pb-2">BASED ON Highest INTENSITY.</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 place-items-center gap-4 lg:gap-10">
              {details?.topSectors[0].sector && (
                <div className="bg-indigo-50 text-lg rounded-xl p-5 text-center">
                  <h1 className="font-extrabold">TOP SECTOR</h1>
                  <p className="font-bold text-blue-500">{details?.topSectors[0].sector}</p>
                </div>
              )}
              {details?.topSectors[0].topic && (
                <div className="bg-green-50 text-lg rounded-xl p-5 text-center">
                  <h1 className="font-extrabold">TOP TOPIC</h1>
                  <p className="font-bold text-blue-500">{details?.topSectors[0].topic}</p>
                </div>
              )}
              {details?.topSectors[0].relevance && (
                <div className="bg-brown-50 text-lg rounded-xl p-5 text-center">
                  <h1 className="font-extrabold">TOP RELEVANCE</h1>
                  <p className="font-bold text-blue-500">{details?.topSectors[0].relevance}</p>
                </div>
              )}
              {details?.topSectors[0].country && (
                <div className="bg-red-50 text-lg rounded-xl p-5 text-center">
                  <h1 className="font-extrabold">TOP COUNTRY</h1>
                  <p className="font-bold text-blue-500">{details?.topSectors[0].country}</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-orange-50 text-lg rounded-xl p-5 my-2 text-center w-full">
              <h1 className="font-extrabold">TOP TITLE</h1>
              <p className="font-bold text-blue-500 text-sm">{details?.topSectors[0].title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
