import { stepper, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MetricsCard } from '../Components/Cards';
import { useAuth } from '../Context/Context';
import { useError } from '../Context/ErrorContext';
import { BarChart, DoughnutChart, LineChart, PieChart, StackedLineBar } from '../Components/Charts';

function Analytics() {
  const { userDetails } = useAuth();
  const { triggerError } = useError();
  const [details, setDetails] = useState(null);
  const [chartData, setChartData] = useState({
    Bar: { labels: [], datasets: [] },
    Bar2: { labels: [], datasets: [] },
    Stacked: { labels: [], datasets: [] },
    Doughnut: { labels: [], datasets: [] },
    Pie: { labels: [], datasets: [] },
    Line: { labels: [], datasets: [] },
    LineBar: { labels: [], datasets: [] },
  });

  useEffect(() => {
    axios.get('/api/v1/visualize/analysis')
      .then(res => {
        setChartData({
          Bar: {
            labels: res?.data.data?.countriesByLikelihood.map(data => data.country),
            datasets: [{
              label: "Likelihood",
              backgroundColor: "cyan",
              data: res?.data?.data?.countriesByLikelihood.map(data => data.likelihood)
            }]
          },
          Stacked: {
            labels: res.data.data.pestle_distribution.map(data => data.pestle),
            datasets: [{
              label: "Pestle Count",
              data: res.data.data.pestle_distribution.map(data => data.count)
            }]
          },
          Pie: {
            labels: res?.data?.data?.source_contribution.map(data => data.source),
            datasets: [{
              label: "Source Count",
              data: res.data.data?.source_contribution.map(data => data.count)
            }]
          },
          Bar2: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [
              {
                label: 'Titles',
                data: [
                  res.data.data.sentiment_analysis.titles.positive,
                  res.data.data.sentiment_analysis.titles.negative,
                  res.data.data.sentiment_analysis.titles.neutral
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: 'Insights',
                data: [
                  res.data.data.sentiment_analysis.insights.positive,
                  res.data.data.sentiment_analysis.insights.negative,
                  res.data.data.sentiment_analysis.insights.neutral
                ],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
              }
            ]
          },
          Line: {
            labels: [2015, 2020, 2025, 2030, 2035, 2040, 2045],
            datasets: [
              {
                label: 'Average Impact',
                data: res.data.data.impact_relevance_analysis.map(data => data.average_impact)
              },
              {
                label: "Average Relevance",
                data: res.data.data.impact_relevance_analysis.map(data => data.average_relevance)
              }
            ]
          },
          LineBar: {
            labels: res.data.data.insights_by_url.map(data => data.insight_count),
            datasets: [
              {
                label: 'Insight Count',
                data: res.data.data.insights_by_url.map(data => data.insight_count)
              },
              {
                label: 'Relevance Count',
                data: res.data.data.insights_by_url.map(data => data.average_relevance)
              }
            ]
          }
        });
        console.log("Analysis Fetched", res.data.data);
        setDetails(res.data.data);
      })
      .catch(err => {
        triggerError(err);
      });
  }, []);

  return (
    <div className="w-10/12 lg:min-w-10/12 bg-indigo-50 min-h-screen lg:ml-72 px-4 md:px-6 lg:px-6 py-5">
      <h1 className='font-extrabold text-4xl '>Analytics</h1>
      <div className='bg-white w-full h-fit p-5 mt-4 rounded-xl'>
        <h1 className="font-extrabold text-xl text-center">Likelihood for Each Country</h1>
        <BarChart chartData={chartData.Bar} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 place-items-end py-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full place-items-center gap-4'>
          <div className='bg-white w-full aspect-[6/4] grid place-items-center p-5 rounded-xl'>
            <h1 className="font-extrabold text-xl text-center">Source Contribution Analysis</h1>
            <PieChart chartData={chartData.Pie} />
          </div>
          <div className='bg-white w-full aspect-[6/4] p-5 rounded-xl'>
            <h1 className="font-extrabold text-xl text-center">Pestle Factor Distribution</h1>
            <DoughnutChart chartData={chartData.Stacked} />
          </div>
        </div>
        <div className='bg-white w-full h-fit p-5 rounded-xl'>
          <h1 className="font-extrabold text-xl text-center">Title and Insight Sentiment Analysis</h1>
          <BarChart chartData={chartData.Bar2} />
        </div>
        <div className='bg-white w-full h-fit p-5 rounded-xl'>
          <h1 className="font-extrabold text-xl text-center">Impact v/s Relevance over Time</h1>
          <LineChart chartData={chartData.Line} />
        </div>
        <div className='bg-white w-full h-fit p-5 rounded-xl'>
          <h1 className="font-extrabold text-xl text-center">Insights by URL</h1>
          <StackedLineBar chartData={chartData.LineBar} />
        </div>
      </div>
      <div className="w-full bg-indigo-50 min-h-fit p-4">
        {details?.get_metrics ? (
          <MetricsCard metrics={details.get_metrics} />
        ) : (
          <p className="text-center">Loading metrics data...</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;
