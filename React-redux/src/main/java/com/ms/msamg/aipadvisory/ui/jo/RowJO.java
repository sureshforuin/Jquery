package com.ms.msamg.aipadvisory.ui.jo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RowJO {

	private String timeFrame;
	private List<DataJO> data;

	public String getTimeFrame() {
		return timeFrame;
	}

	public void setTimeFrame(String timeFrame) {
		this.timeFrame = timeFrame;
	}

	public List<DataJO> getData() {
		return data;
	}

	public void setData(List<DataJO> data) {
		this.data = data;
	}
}
