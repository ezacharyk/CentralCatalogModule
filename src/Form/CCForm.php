<?php

namespace Drupal\central_catalog_module\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface; 
use Drupal\techzone_module\Functions\BasicFunction;
use Drupal\central_Catalog_module\Functions\CentralCatalogFunction;
use Drupal\taxonomy\Entity\Vocabulary;

class CCForm extends FormBase {

  public function getFormId() { 
    return 'central_catalog_module_cc_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
      //Do not cache this page
      $form['#cache']['max-age'] = 0;
      \Drupal::service('page_cache_kill_switch')->trigger();
      //Browser - Do not cache this page
      header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
      header("Cache-Control: post-check=0, pre-check=0", false);
      header("Pragma: no-cache");
      
      
		$form['#attached']['library'][] = 'central_catalog_module/central_catalog';
    $form['#attached']['library'][] = 'central_catalog_module/bootstrap';

		$vocabularies = Vocabulary::loadMultiple();
		foreach ($vocabularies as $key => $vocabulary) {
			$weight = $vocabulary->get('weight');
			$vocabulary_name = str_replace('CC ', '', $vocabulary->get('name'));
			$vocab[] = [
				'weight' => $weight,
				'vid' => $vocabulary->id(),
				'name' => $vocabulary_name
			];
		}
		usort($vocab, function($a, $b) {
			return $a['weight'] <=> $b['weight'];
		});

    $form['description'] = [
      '#type' => 'item',
      '#markup' => $this->t('The Central Catalog is the cornerstone of Tech Zone. It powers how customers find information and it forms the backbone of your content management process. Think three times before making a change. Every edit made here is amplified to the customers. Don’t over use it. Sometimes less is more. Don’t tag everything you can think of. Try to keep this small, light and manageable.'),
    ];
		$form['central-catalog'] = array(
					'#type' => 'container',
						'#attributes' => array(
							'class' => array('central-catalog')
						),
				);
		$form['central-catalog']['panel-group'] = array(
					'#type' => 'container',
					'#attributes' => array(
						'id' => 'sortable',
						'class' => array('panel-group'),
					),
						'#tree' => TRUE,
				);
 
		foreach ($vocab as $key => $vocabulary) {
			$vid = $vocabulary['vid'];
			$name = $vocabulary['name'];
			$weight = $key;
			
			if(strpos($vid, 'cc_') !== false){
				$get_terms = BasicFunction::vmware_get_terms($vid);
				/*$form['central-catalog']['panel-group'][$vid] = array(
						'#type' => 'container',
						'#tree' => TRUE,
					);*/
				$form['central-catalog']['panel-group'][$vid]['panel-sort'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'data-panel' => $vid,
							'data-vid' => $vid,
							'class' => array('panel','panel-sort')
						),
					);
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-heading'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('panel-heading')
						),
					);
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-heading']['panel-title'] = [
					'#type' => 'html_tag',
					'#tag' => 'span',
						'#attributes' => array(
							'class' => array('panel-title')
						),
					'#value' => $this->t($name),
				];
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-heading']['edit-section'] = [
					'#type' => 'html_tag',
					'#tag' => 'span',
						'#attributes' => array(
							'class' => array('edit','edit-section')
						),
					'#value' => $this->t('Edit Section'),
				];

				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-heading']['drag'] = array(
					'#markup' => '<span class="drag"><img src="/dist/img/svg-sprite/basic/drag.svg" class="icon-drag"></span>',
				);
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-heading']['view'] = [
					'#type' => 'html_tag',
					'#tag' => 'span',
						'#attributes' => array(
							'class' => array('view')
						),
					'#value' => $this->t('View Terms'),
				];
				
				
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('panel-collapse')
						),
					);
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('panel-body')
						),
					);
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['terms-wrap'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('terms-wrap')
						),
						'#tree' => TRUE,
					);
					
				if(isset($get_terms) && !empty($get_terms)){
					$order = 1;
					foreach($get_terms as $key => $value) {
						$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['terms-wrap'][$key] = array(
							'#markup' => '<div class="term-wrap">
										<span class="term" data-order="'.$order.'" data-tx="'.$vid.'" data-tr="'.$key.'">'.$value.'</span></div>',
						);
						$order++;
					}
				} else {
					$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['terms-wrap']['no-terms'] = array(
						'#markup' => '<div class="no_term_found">No term found</div>',
					);
				}

				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['action-wrap'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('action-wrap')
						),
					);
					
				$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['action-wrap']['add-term-btn'] = array(
					'#markup' => '<a class="btn action-btn add-term-btn"><i class="fa fa-times"></i> + Add Term</a>',
				);
				if(isset($get_terms) && empty($get_terms)){
					$form['central-catalog']['panel-group'][$vid]['panel-sort']['panel-collapse']['panel-body']['action-wrap']['remove-section'] = array(
						'#markup' => '<a class="btn action-btn remove-section"><span class="icon-delete"><img src="/dist/img/svg-sprite/basic/delete.svg" class="icon-delete"></span>Delete Section</a>',
					);
				}
				
			}
    }
		$form['central-catalog']['panel-group']['new']['panel-default'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'data-panel' => $vid,
							'data-vid' => $vid,
							'class' => array('panel','panel-default')
						),
					);
				$form['central-catalog']['panel-group']['new']['panel-default']['panel-heading'] = array(
						'#type' => 'container',
						'#attributes' => array(
							'class' => array('panel-heading')
						),
					);
				$form['central-catalog']['panel-group']['new']['panel-default']['panel-heading']['pantel-title'] = [
					'#markup' => '<h4 class="panel-title add-section"><img src="/dist/img/svg-sprite/basic/add.svg" class="icon-add">Add Section</h4>',
				];

    return $form;
  }
  public function updatedetails(array $form, FormStateInterface $form_state) {
    return $form['central_catalog'];
  }
 
  

  /**
   * Implements form validation.
   *
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * Implements a form submit handler.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    
  }

}
