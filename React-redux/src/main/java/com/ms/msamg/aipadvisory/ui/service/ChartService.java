package com.ms.msamg.aipadvisory.ui.service;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;
import org.slf4j.Logger;

import com.ms.msamg.aipadvisory.ui.data.ChartStore;

import io.swagger.annotations.Api;
import msjava.base.slf4j.ContextLogger;
import msjava.cxfutils.autoconf.experimental.annotation.transport.HTTPServerTransport;

@Api
@HTTPServerTransport(name = "commonTransport", mapping = "/msamg.aip-advisory-portal-ui/services/chartService")
@Named
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class ChartService {

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Inject
	private ChartStore chartStore;

	@GET
	@Path("{entityId}/approachTwo/Fund1/{fileName}")
	public String approachOne(@PathParam("entityId") String entityId, @PathParam("fileName") String fileName) {
		long start = System.nanoTime();
		String output = chartStore.getChartData(entityId, fileName).toString();
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return output;
	}

	@GET
	@Path("{entityType}/{entityId}/{source}/{fileName}")
	public String getChart(@PathParam("entityType") String entityType, @PathParam("entityId") String entityId,
			@PathParam("source") String source, @PathParam("fileName") String fileName) {
		long start = System.nanoTime();
		String output = chartStore.getChartData(entityType, entityId, source, fileName).toString();
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return output;
	}

	@GET
	@Path("/historicRequest/{fundrunnerids}")
	public String historicRequest(@PathParam("fundrunnerids") String fundrunnerIds,
			@QueryParam("frequency") String frequency) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchHistoricalFundSeries(fundrunnerIds, frequency);
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();
	}

	@GET
	@Path("/commulativeRequest/{fundrunnerid}")
	public String commulativeRequest(@PathParam("fundrunnerid") String fundrunnerId) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchFundRunnerSeries(fundrunnerId, "1");
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();
	}

	@GET
	@Path("/rollingReturnRequest/{fundrunnerid}")
	public String rollingReturnRequest(@PathParam("fundrunnerid") String fundrunnerId) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchFundRunnerSeries(fundrunnerId, "1");
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();
	}

	@GET
	@Path("/annualizedStat/{fundrunnerid}")
	public String annualizedStat(@PathParam("fundrunnerid") String fundrunnerId) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchAnnualizedStatSeries(fundrunnerId);
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();
	}

	@GET
	@Path("/annualizedStatWithDates")
	public String annualizedStatWithDates(@QueryParam("fundIds") List<String> fundIds,
			@QueryParam("benchmarkIds") List<String> benchmarkIds, @QueryParam("fromDate") String fromDate,
			@QueryParam("toDate") String toDate) {
		long start = System.nanoTime();
		String resultText = chartStore.fetchAnnualizedStatFromLIMA(fundIds, benchmarkIds, fromDate, toDate);
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return resultText;
	}

	@GET
	@Path("/performanceChart/{fundrunnerid}")
	public String overviewPerformanceChart(@PathParam("fundrunnerid") String fundrunnerId) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchPerformanceOverviewSeries(fundrunnerId);
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();
	}

	@GET
	@Path("/months/{fundrunnerids}")
	public String rollingMonths(@PathParam("fundrunnerids") String fundrunnerids, @QueryParam("period") String period) {
		long start = System.nanoTime();
		JSONObject fileDataJSONObj = chartStore.fetchRollingMonths(fundrunnerids, period);
		LOGGER.info("Time taken to process JSON from store = {} ms", (System.nanoTime() - start) / 1_000_000.0);
		return fileDataJSONObj.toString();

	}

	@GET
	@Path("/analysis/correlatedFunds")
	public String correlatedFunds(@QueryParam("fundId") String fundId, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.fetchCorrelatedFundsCustomDateFromLima(fundId, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting correlatedFunds for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	
	@GET
	@Path("/analysis/correlatedAlpha")
	public String correlatedAlpha(@QueryParam("fundId") String fundId, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.fetchCorrelatedAlphaCustomDateFromLima(fundId, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting correlatedAlpha for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	
	@GET
	@Path("/analysis/regressionModel/customDate")
	public String regressionModelCustomDate(@QueryParam("fundId") String fundId, 
			@QueryParam("benchmarkIds") List<String> benchmarkIds, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.fetchRegressionModelCustomDateFromLima(fundId,benchmarkIds, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting correlatedAlpha for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	
	
	
	@GET
	@Path("/analysis/upDownBetaCapture/customDate")
	public String upDownBetaCapture(@QueryParam("fundId") String fundId, 
			@QueryParam("benchmarkIds") List<String> benchmarkIds, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.fetchUpDownBetaCaptureCustomDateFromLima(fundId,benchmarkIds, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting correlatedAlpha for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	@GET
	@Path("/analysis/rollingFit/customDate")
	public String rollingFitCustomDate(@QueryParam("fundId") String fundId, 
			@QueryParam("benchmarkIds") List<String> benchmarkIds, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.fetchRollingFitCustomDate(fundId,benchmarkIds, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting rollingFit for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	
	@GET
	@Path("/analysis/addBenchMark")
	public String addBenchmark(@QueryParam("fundId") String fundId, 
			@QueryParam("benchmarkIds") List<String> benchmarkIds, @QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		String result;
		try {

			result = chartStore.addBenchMark(fundId,benchmarkIds, startDate, endDate);

		} catch (Exception e) {
			result = "Exception in getting addBenchMark for performance for: " + fundId + ", startDate:" + startDate
					+ ", endDate: " + endDate;
		}
		return result;
	}
	
	

}
