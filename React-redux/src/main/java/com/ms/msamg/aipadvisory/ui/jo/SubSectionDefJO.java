package com.ms.msamg.aipadvisory.ui.jo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SubSectionDefJO {

	@JsonProperty("timeFrame")
	private String timeFrame;

	@JsonProperty("title")
	private String title;

	@JsonProperty("description")
	private String description;

	@JsonProperty("headers")
	private List<String> headers;

	@JsonProperty("rows")
	@JsonFormat(shape = JsonFormat.Shape.ANY)
	private List<RowJO> rows;

	@JsonProperty("metaData")
	private List<MetaDataJO> metaData;

	@JsonProperty("links")
	private List<String> links;

	public List<MetaDataJO> getMetaData() {
		return metaData;
	}

	public void setMetaData(List<MetaDataJO> metaData) {
		this.metaData = metaData;
	}

	public List<String> getLinks() {
		return links;
	}

	public void setLinks(List<String> links) {
		this.links = links;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getHeaders() {
		return headers;
	}

	public void setHeaders(List<String> headers) {
		this.headers = headers;
	}

	public List<RowJO> getRows() {
		return rows;
	}

	public void setRows(List<RowJO> rows) {
		this.rows = rows;
	}

	public String getTimeFrame() {
		return timeFrame;
	}

	public void setTimeFrame(String timeFrame) {
		this.timeFrame = timeFrame;
	}

}
