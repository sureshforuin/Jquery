package com.ms.msamg.aipadvisory.ui.data;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.cxf.common.util.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;

import com.ms.msamg.aipadvisory.ui.service.SpnegoClient;
import com.ms.msamg.aipadvisory.ui.util.Constants;

import msjava.base.slf4j.ContextLogger;

@Named
public class ChartStore {

	private String rootLocation;

	private static final Logger LOGGER = ContextLogger.safeLogger();

	@Inject
	private Store store;
	@Inject
	private SpnegoClient spnegoClient;

	@Value("${aipadvisory.service.url}")
	private String serviceUrl;

	@Value("${aipadisory.performanceService.path}")
	private String perfServicePath;

	@Value("${aipadisory.performanceService.analysis.correlatedFund.path}")
	private String correlatedFundAnalysis;

	@Value("${aipadisory.performanceService.analysis.correlatedAlpha.path}")
	private String correlatedAlphaAnalysis;
	
	@Value("${aipadisory.performanceService.analysis.regressionModelCustomeDate.path}")
	private String regressionModelCustomDate;
	
	@Value("${aipadisory.performanceService.analysis.upDownBetaCaptureCustomeDate.path}")
	private String upDownBetaCapture;
	
	@Value("${aipadisory.performanceService.analysis.rollingFitCustomDate.path}")
	private String rollingFit;
	
	@Value("${aipadisory.performanceService.analysis.regressionModelCustomeDate.path}")
	private String addBenchMark;

	@PostConstruct
	public void afterPropertiesSet() {
		setRootLocation(store.getRootLocation());
	}

	public JSONObject getChartData(String entityId, String fileName) {
		return store.getDataAsJSONObject(Paths.get(getRootLocation(), entityId, "approachTwo", "Fund1", fileName));
	}

	public String getRootLocation() {
		return rootLocation;
	}

	public void setRootLocation(String rootLocation) {
		this.rootLocation = rootLocation;
	}

	public JSONObject fetchHistoricalFundSeries(String fundrunnerIds, String frequency) {
		JSONObject fundorBenchJSON = new JSONObject();
		try {

			String[] fundrunners = fundrunnerIds.split(",");
			JSONArray fundorBenchLinksArr = new JSONArray();
			JSONObject fundLink = new JSONObject();
			JSONObject benchmarkLink = new JSONObject();
			Integer frequencyInt = 1;
			List<String> fundsForMonthlyFreq = new ArrayList<String>();

			if (null != frequency && frequency.length() > 0) {
				frequencyInt = Integer.parseInt(frequency);
			}

			if (null != fundrunners && fundrunners.length > 0) {
				for (int i = 0; i < fundrunners.length; i++) {

					java.nio.file.Path fundDir = Paths.get(getRootLocation(), Constants.FUNDS);
					if (fundDir.toFile().isDirectory()) {
						String[] fundDirs = fundDir.toFile().list();
						List<String> listFundDir = Arrays.asList(fundDirs);
						if (listFundDir.contains(fundrunners[i])) {
							String fileName = "";

							if (frequencyInt == 1) {
								fileName = Constants.FUND_RETURN + Constants.FILE_EXTENSION_JSON;
								java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS,
										fundrunners[i], Constants.FUND_RUNNER, fileName);
								if (indexFile.toFile().exists()) {
									String indFileURL = fileName;
									fundLink = new JSONObject();
									fundLink.put("fundRunnerId", fundrunners[i]);
									fundLink.put("entityType", "fund");
									fundLink.put("source", "FundRunner");

									fundLink.put("link", indFileURL);
									fundorBenchLinksArr.put(fundLink);

									// Add it to list to retrieve Runups and
									// Drawdowns
									fundsForMonthlyFreq.add(fundrunners[i]);
								}
							} else {
								fileName = Constants.FUND_RETURN + Constants.UNDERSCORE + frequencyInt
										+ Constants.FILE_EXTENSION_JSON;
								java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS,
										fundrunners[i], Constants.FUND_RUNNER, fileName);
								if (indexFile.toFile().exists()) {
									String indFileURL = fileName;

									fundLink.put("fundRunnerId", fundrunners[i]);
									fundLink.put("entityType", "fund");
									fundLink.put("source", "FundRunner");

									fundLink.put("link", indFileURL);
									fundorBenchLinksArr.put(fundLink);
								}
							}

						}
					}

					java.nio.file.Path benchDir = Paths.get(getRootLocation(), Constants.BENCHMARKS);
					if (benchDir.toFile().isDirectory()) {
						String[] benchDirs = benchDir.toFile().list();
						List<String> listBenchDir = Arrays.asList(benchDirs);
						if (listBenchDir.contains(fundrunners[i])) {
							String fileName = "";

							if (frequencyInt == 1) {
								fileName = Constants.BENCHMARK_RETURN + Constants.FILE_EXTENSION_JSON;
							} else {
								fileName = Constants.BENCHMARK_RETURN + Constants.UNDERSCORE + frequencyInt
										+ Constants.FILE_EXTENSION_JSON;
							}
							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.BENCHMARKS,
									fundrunners[i], Constants.FUND_RUNNER, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								benchmarkLink.put("fundRunnerId", fundrunners[i]);
								benchmarkLink.put("entityType", "benchmark");
								benchmarkLink.put("source", "FundRunner");

								benchmarkLink.put("link", indFileURL);
								fundorBenchLinksArr.put(benchmarkLink);
							}
						}
					}
				}
			}

			if (!fundsForMonthlyFreq.isEmpty()) {
				for (String fundId : fundsForMonthlyFreq) {
					// Including Runups and Drawdowns
					String fileRunupName = "fundRunup.json";
					java.nio.file.Path fundRunupFile = Paths.get(getRootLocation(), Constants.FUNDS, fundId,
							Constants.LIMA, fileRunupName);
					if (fundRunupFile.toFile().exists()) {
						fundLink = new JSONObject();
						fundLink.put("fundRunnerId", fundId);
						fundLink.put("entityType", "fund");
						fundLink.put("source", Constants.LIMA);
						fundLink.put("link", fileRunupName);
						fundorBenchLinksArr.put(fundLink);
					}

					String fileDrawdownName = "fundDrawdowns.json";
					java.nio.file.Path fundDrawdownFile = Paths.get(getRootLocation(), Constants.FUNDS, fundId,
							Constants.LIMA, fileDrawdownName);
					if (fundDrawdownFile.toFile().exists()) {
						fundLink = new JSONObject();
						fundLink.put("fundRunnerId", fundId);
						fundLink.put("entityType", "fund");
						fundLink.put("source", Constants.LIMA);

						fundLink.put("link", fileDrawdownName);
						fundorBenchLinksArr.put(fundLink);
					}
				}
			}

			fundorBenchJSON.put(Constants.LINKS, fundorBenchLinksArr);

		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return fundorBenchJSON;
	}

	public JSONObject fetchFundRunnerSeries(String fundrunnerIds, String frequency) {
		JSONObject fundorBenchJSON = new JSONObject();
		try {

			String[] fundrunners = fundrunnerIds.split(",");
			JSONArray fundorBenchLinksArr = new JSONArray();
			JSONObject fundLink = new JSONObject();
			JSONObject benchmarkLink = new JSONObject();
			Integer frequencyInt = 1;

			if (null != frequency && frequency.length() > 0) {
				frequencyInt = Integer.parseInt(frequency);
			}

			if (null != fundrunners && fundrunners.length > 0) {
				for (int i = 0; i < fundrunners.length; i++) {

					java.nio.file.Path fundDir = Paths.get(getRootLocation(), Constants.FUNDS);
					if (fundDir.toFile().isDirectory()) {
						String[] fundDirs = fundDir.toFile().list();
						List<String> listFundDir = Arrays.asList(fundDirs);
						if (listFundDir.contains(fundrunners[i])) {
							String fileName = "";

							if (frequencyInt == 1) {
								fileName = Constants.FUND_RETURN + Constants.FILE_EXTENSION_JSON;
								java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS,
										fundrunners[i], Constants.FUND_RUNNER, fileName);
								if (indexFile.toFile().exists()) {
									fundLink = new JSONObject();
									fundLink.put("fundRunnerId", fundrunners[i]);
									fundLink.put("entityType", "fund");
									fundLink.put("source", "FundRunner");

									fundLink.put("link", fileName);
									fundorBenchLinksArr.put(fundLink);
								}
							} else {
								fileName = Constants.FUND_RETURN + Constants.UNDERSCORE + frequencyInt
										+ Constants.FILE_EXTENSION_JSON;
								java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS,
										fundrunners[i], Constants.FUND_RUNNER, fileName);
								if (indexFile.toFile().exists()) {

									fundLink.put("fundRunnerId", fundrunners[i]);
									fundLink.put("entityType", "fund");
									fundLink.put("source", "FundRunner");

									fundLink.put("link", fileName);
									fundorBenchLinksArr.put(fundLink);
								}
							}

						}
					}

					java.nio.file.Path benchDir = Paths.get(getRootLocation(), Constants.BENCHMARKS);
					if (benchDir.toFile().isDirectory()) {
						String[] benchDirs = benchDir.toFile().list();
						List<String> listBenchDir = Arrays.asList(benchDirs);
						if (listBenchDir.contains(fundrunners[i])) {
							String fileName = "";

							if (frequencyInt == 1) {
								fileName = Constants.BENCHMARK_RETURN + Constants.FILE_EXTENSION_JSON;
							} else {
								fileName = Constants.BENCHMARK_RETURN + Constants.UNDERSCORE + frequencyInt
										+ Constants.FILE_EXTENSION_JSON;
							}
							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.BENCHMARKS,
									fundrunners[i], Constants.FUND_RUNNER, fileName);
							if (indexFile.toFile().exists()) {

								benchmarkLink.put("fundRunnerId", fundrunners[i]);
								benchmarkLink.put("entityType", "benchmark");
								benchmarkLink.put("source", "FundRunner");

								benchmarkLink.put("link", fileName);
								fundorBenchLinksArr.put(benchmarkLink);
							}
						}
					}
				}
			}
			fundorBenchJSON.put(Constants.LINKS, fundorBenchLinksArr);

		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return fundorBenchJSON;
	}

	public JSONObject fetchAnnualizedStatSeries(String fundrunnerIds) {
		JSONObject fundorBenchJSON = new JSONObject();
		try {

			String[] fundrunners = fundrunnerIds.split(",");
			JSONArray fundorBenchLinksArr = new JSONArray();
			JSONObject fundLink = new JSONObject();
			JSONObject benchmarkLink = new JSONObject();

			if (null != fundrunners && fundrunners.length > 0) {
				for (int i = 0; i < fundrunners.length; i++) {

					java.nio.file.Path fundDir = Paths.get(getRootLocation(), Constants.FUNDS);
					if (fundDir.toFile().isDirectory()) {
						String[] fundDirs = fundDir.toFile().list();
						List<String> listFundDir = Arrays.asList(fundDirs);
						if (listFundDir.contains(fundrunners[i])) {
							String fileName = "annualizedStats.json";

							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS, fundrunners[i],
									Constants.LIMA, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								fundLink.put("fundRunnerId", fundrunners[i]);
								fundLink.put("entityType", "fund");
								fundLink.put(Constants.SOURCE, Constants.LIMA);

								fundLink.put(Constants.LINK, indFileURL);
								fundorBenchLinksArr.put(fundLink);
							}
						}
					}

					java.nio.file.Path benchDir = Paths.get(getRootLocation(), Constants.BENCHMARKS);
					if (benchDir.toFile().isDirectory()) {
						String[] benchDirs = benchDir.toFile().list();
						List<String> listBenchDir = Arrays.asList(benchDirs);
						if (listBenchDir.contains(fundrunners[i])) {
							String fileName = "annualizedPerformancesnp.json";

							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.BENCHMARKS,
									fundrunners[i], Constants.LIMA, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								benchmarkLink.put("fundRunnerId", fundrunners[i]);
								benchmarkLink.put("entityType", "benchmark");
								benchmarkLink.put(Constants.SOURCE, Constants.LIMA);

								benchmarkLink.put(Constants.LINK, indFileURL);
								fundorBenchLinksArr.put(benchmarkLink);
							}
						}
					}
				}
			}
			fundorBenchJSON.put(Constants.LINKS, fundorBenchLinksArr);

		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return fundorBenchJSON;
	}

	public JSONObject fetchPerformanceOverviewSeries(String fundrunnerIds) {
		JSONObject fundorBenchJSON = new JSONObject();
		try {

			String[] fundrunners = fundrunnerIds.split(",");
			JSONArray fundorBenchLinksArr = new JSONArray();
			JSONObject fundLink = new JSONObject();
			// JSONObject benchmarkLink = new JSONObject();

			if (null != fundrunners && fundrunners.length > 0) {
				for (int i = 0; i < fundrunners.length; i++) {

					java.nio.file.Path fundDir = Paths.get(getRootLocation(), Constants.FUNDS);
					if (fundDir.toFile().isDirectory()) {
						String[] fundDirs = fundDir.toFile().list();
						List<String> listFundDir = Arrays.asList(fundDirs);
						if (listFundDir.contains(fundrunners[i])) {
							String fileName = "overviewFundPerf.json";

							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS, fundrunners[i],
									Constants.LIMA, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								fundLink.put("fundRunnerId", fundrunners[i]);
								fundLink.put("entityType", "fund");
								fundLink.put(Constants.SOURCE, Constants.LIMA);

								fundLink.put(Constants.LINK, indFileURL);
								fundorBenchLinksArr.put(fundLink);
							}
						}
					}

					/*
					 * Retained as commented code for future use
					 * 
					 * java.nio.file.Path benchDir =
					 * Paths.get(getRootLocation(), Constants.BENCHMARKS); if
					 * (benchDir.toFile().isDirectory()) { String[] benchDirs =
					 * benchDir.toFile().list(); List<String> listBenchDir =
					 * Arrays.asList(benchDirs); if
					 * (listBenchDir.contains(fundrunners[i])) { String fileName
					 * = "benchmarkPerf.json";
					 * 
					 * java.nio.file.Path indexFile =
					 * Paths.get(getRootLocation(), Constants.BENCHMARKS,
					 * fundrunners[i], Constants.LIMA, fileName); if
					 * (indexFile.toFile().exists()) { String indFileURL =
					 * fileName;
					 * 
					 * benchmarkLink.put("fundRunnerId", fundrunners[i]);
					 * benchmarkLink.put("entityType", "benchmark");
					 * benchmarkLink.put(Constants.SOURCE, Constants.LIMA);
					 * 
					 * benchmarkLink.put(Constants.LINK, indFileURL);
					 * fundorBenchLinksArr.put(benchmarkLink); } } }
					 */
				}
			}
			fundorBenchJSON.put(Constants.LINKS, fundorBenchLinksArr);

		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return fundorBenchJSON;
	}

	public JSONObject fetchRollingMonths(String fundrunnerIds, String period) {

		JSONObject rollingJSON = new JSONObject();
		try {

			String[] fundrunners = fundrunnerIds.split(",");
			JSONArray rollingFundBenchmark = new JSONArray();
			JSONObject fundLink = new JSONObject();
			JSONObject benchmarkLink = new JSONObject();
			Integer periodInt = 0;

			if (null != period && period.length() > 0) {
				periodInt = Integer.parseInt(period);
			}

			if (null != fundrunners && fundrunners.length > 0) {
				for (int i = 0; i < fundrunners.length; i++) {

					java.nio.file.Path fundDir = Paths.get(getRootLocation(), Constants.FUNDS, fundrunners[i],
							"FundRunner");
					if (fundDir.toFile().isDirectory()) {
						String[] fundDirs = fundDir.toFile().list();
						List<String> listFundDir = Arrays.asList(fundDirs);

						String fileName = "";

						fileName = Constants.ROLLING + periodInt + Constants.MONTH + Constants.FILE_EXTENSION_JSON;

						if (listFundDir.contains(fileName)) {
							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.FUNDS, fundrunners[i],
									Constants.FUND_RUNNER, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								fundLink.put("fundRunnerId", fundrunners[i]);
								fundLink.put("entityType", "fund");
								fundLink.put("source", "FundRunner");

								fundLink.put("link", indFileURL);
								rollingFundBenchmark.put(fundLink);
							}

						}

					}

					java.nio.file.Path benchDir = Paths.get(getRootLocation(), Constants.BENCHMARKS, fundrunners[i],
							"FundRunner");
					if (benchDir.toFile().isDirectory()) {
						String[] benchDirs = benchDir.toFile().list();
						List<String> listBenchDir = Arrays.asList(benchDirs);

						String fileName = "";

						fileName = Constants.ROLLING + periodInt + Constants.MONTH + Constants.FILE_EXTENSION_JSON;

						if (listBenchDir.contains(fileName)) {
							java.nio.file.Path indexFile = Paths.get(getRootLocation(), Constants.BENCHMARKS,
									fundrunners[i], Constants.FUND_RUNNER, fileName);
							if (indexFile.toFile().exists()) {
								String indFileURL = fileName;

								benchmarkLink.put("fundRunnerId", fundrunners[i]);
								benchmarkLink.put("entityType", "benchmark");
								benchmarkLink.put("source", "FundRunner");

								benchmarkLink.put("link", indFileURL);
								rollingFundBenchmark.put(benchmarkLink);
							}

						}

					}
				}
			}
			rollingJSON.put(Constants.LINKS, rollingFundBenchmark);

		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return rollingJSON;

	}

	public JSONObject getChartData(String entityType, String entityId, String source, String fileName) {
		return store.getDataAsJSONObject(Paths.get(rootLocation, entityType, entityId, source, fileName));
	}

	public String fetchAnnualizedStatFromLIMA(List<String> fundIds, List<String> benchmarkIds, String fromDate,
			String toDate) {
		String perfAnnualizedData = null;
		CloseableHttpResponse response = null;

		if (!fundIds.isEmpty() && !benchmarkIds.isEmpty() && !StringUtils.isEmpty(fromDate)
				&& !StringUtils.isEmpty(toDate)) {

			DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
			DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

			LocalDate fromlocalDate = LocalDate.parse(fromDate, sourceformatter);
			String fromDateFormatted = fromlocalDate.format(targetformatter);

			LocalDate tolocalDate = LocalDate.parse(toDate, sourceformatter);
			String toDateFormatted = tolocalDate.format(targetformatter);

			try {
				URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
						.setPath(perfServicePath).setParameter(Constants.START_DATE, fromDateFormatted)
						.setParameter(Constants.END_DATE, toDateFormatted);

				for (String fund : fundIds) {
					uriBuilder.addParameter(Constants.FUND_ID, fund);
				}

				for (String bm : benchmarkIds) {
					uriBuilder.addParameter(Constants.BENCHMARK_ID, bm);
				}
				URI uri = uriBuilder.build();
				String uriString = uri.toString().replaceAll("%2C", ";");
				uriString = uriString.toString().replaceAll(",", ";");

				HttpGet httpget = new HttpGet(uriString);
				LOGGER.info(httpget.getURI().toString());
				response = spnegoClient.getHttpClient().execute(httpget);
				perfAnnualizedData = EntityUtils.toString(response.getEntity());
			} catch (Exception e) {
				LOGGER.error(e.getMessage());
			} finally {
				try {
					if (null != response) {
						response.close();
					}
				} catch (IOException e) {
					LOGGER.error(e.getMessage());
				}
			}
		}

		return perfAnnualizedData;
	}

	public String fetchCorrelatedFundsCustomDateFromLima(String fundId, String fromDate, String toDate)
			throws ParseException {

		String correlatedFundData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(fromDate) && !StringUtils.isEmpty(toDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(fromDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(toDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(correlatedFundAnalysis).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					correlatedFundData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return correlatedFundData;

	}

	public String fetchCorrelatedAlphaCustomDateFromLima(String fundId, String fromDate, String toDate)
			throws ParseException {

		String correlatedAlphaData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(fromDate) && !StringUtils.isEmpty(toDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(fromDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(toDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(correlatedAlphaAnalysis).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					correlatedAlphaData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return correlatedAlphaData;

	}
	
	public String fetchRegressionModelCustomDateFromLima(String fundId, List<String> benchmarkIds, String fromDate, String toDate)
			throws ParseException {
		String regressionModelData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(fromDate) && !StringUtils.isEmpty(toDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(fromDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(toDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(regressionModelCustomDate).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					for (String bm : benchmarkIds) {
						uriBuilder.addParameter(Constants.BENCHMARK_ID, bm);
					}

					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					regressionModelData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return regressionModelData;
		
	}
	
	
	public String fetchUpDownBetaCaptureCustomDateFromLima(String fundId, List<String> benchmarkIds, String fromDate, String toDate)
			throws ParseException {
		String upDownBetaCaptureData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(fromDate) && !StringUtils.isEmpty(toDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(fromDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(toDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(upDownBetaCapture).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					for (String bm : benchmarkIds) {
						uriBuilder.addParameter(Constants.BENCHMARK_ID, bm);
					}

					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					upDownBetaCaptureData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return upDownBetaCaptureData;
	
	}
	
	
	

	public String fetchRollingFitCustomDate(String fundId, List<String> benchmarkIds, String startDate,
			String endDate) {
		
		String rollingFitData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(startDate) && !StringUtils.isEmpty(endDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(startDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(endDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(rollingFit).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					for (String bm : benchmarkIds) {
						uriBuilder.addParameter(Constants.BENCHMARK_ID, bm);
					}

					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					rollingFitData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return rollingFitData;
	}
	
	
	public String addBenchMark(String fundId, List<String> benchmarkIds, String startDate,
			String endDate) {
		String addBenchMarkData = null;
		CloseableHttpResponse response = null;

		try {
			if (!fundId.isEmpty() && !StringUtils.isEmpty(startDate) && !StringUtils.isEmpty(endDate)) {

				DateTimeFormatter sourceformatter = DateTimeFormatter.ofPattern(Constants.MM_DD_YYYY);
				DateTimeFormatter targetformatter = DateTimeFormatter.ofPattern(Constants.DDMMMYYYY);

				LocalDate fromlocalDate = LocalDate.parse(startDate, sourceformatter);
				String fromDateFormatted = fromlocalDate.format(targetformatter);

				LocalDate tolocalDate = LocalDate.parse(endDate, sourceformatter);
				String toDateFormatted = tolocalDate.format(targetformatter);
				try {
					URIBuilder uriBuilder = new URIBuilder().setScheme(Constants.HTTP).setHost(serviceUrl)
							.setPath(addBenchMark).setParameter(Constants.START_DATE, fromDateFormatted)
							.setParameter(Constants.END_DATE, toDateFormatted);
					uriBuilder.addParameter(Constants.FUND_ID, fundId);
					for (String bm : benchmarkIds) {
						uriBuilder.addParameter(Constants.BENCHMARK_ID, bm);
					}

					HttpGet httpget = new HttpGet(uriBuilder.build());
					LOGGER.info(httpget.getURI().toString());
					response = spnegoClient.getHttpClient().execute(httpget);
					addBenchMarkData = EntityUtils.toString(response.getEntity());
				} catch (Exception e) {
					LOGGER.error(e.getMessage());
				} finally {
					try {
						if (null != response) {
							response.close();
						}
					} catch (IOException e) {
						LOGGER.error(e.getMessage());
					}
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		return addBenchMarkData;
		
		
	}
	
	

}
