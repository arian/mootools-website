<?php

class Search {
	
	public function __construct(){	
		Solarium_Autoloader::register();
	}
	
	public function connect(){
		$client = new Solarium_Client();
		$ping = $client->createPing();
		try {
		    $client->ping($ping);
			$this->connected = 1;
		} catch(Solarium_Exception $e){
		    $this->connected = 0;
		}	
	}
	
	public function query($searchterm){
		$this->connect();
		if ($this->connected){
			$client = new Solarium_Client();
			$query = $client->createSelect();
			$query->setQuery($searchterm);
			$resultsset = $client->select($query);
			return $this->getResultsHTML($resultsset);
		} else {
			return $this->getErrorMessage($searchterm);
		}
	}
	
	public function getResultsHTML($resultsset){
		$html = '<h3>Related Content</h3>';
		$html.= '<ul>';
		foreach ($resultsset as $document){
			$html .= '<li>' .
					'<h4><a href="' . $document['url'] . '">' . $document['name'] . '</a></h4>' .
				'</li>';
		}
		$html.= '</ul>';
		return $html;
	}
	
	public function getErrorMessage($searchterm){
		return '<div class="alert alert-error">' .
					'<h4 class="alert-heading">Oh no! Our Search Engine is down!</h4>' .
					'<p>Sorry! We\'ll look into that right away. In the mean time, why not try a <a href="#">Google Search</a>?</p>' .
				'</div>';
	}
	
}

?>