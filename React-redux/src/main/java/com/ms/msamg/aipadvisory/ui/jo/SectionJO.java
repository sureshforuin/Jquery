package com.ms.msamg.aipadvisory.ui.jo;

import java.util.List;

public class SectionJO {

	private String title;
	private List<SubSectionIndexJO> data;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<SubSectionIndexJO> getData() {
		return data;
	}

	public void setData(List<SubSectionIndexJO> data) {
		this.data = data;
	}

}
