<?php

namespace Drupal\central_catalog_module\Controller;

use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Cache\CacheableJsonResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller routines for page example routes.
 */
class CentralCatalogController extends ControllerBase {
  /**
   * {@inheritdoc}
   */
  public function getModuleName() {
    return 'central_catalog_module';
  }

  public function ccpage() {
    return [
      '#type' => 'markup',
      '#markup' => '<p>' . $this->t('Simple page: The quick brown fox jumps over the lazy dog.') . '</p>',
    ];
  }
  public static function set_cc_add_term() {
      $vid = $_POST['vid'];
      $name = $_POST['name'];
      if(isset($vid) && !empty($vid) && isset($name) && !empty($name)){

        $query = \Drupal::entityQuery('taxonomy_term');
        $query->condition('vid', $vid);
        $query->condition('name', $name);
        $tids = $query->execute();
        $message = "Term already exists.";
        if(!$tids) {
          $term = Term::create([
            'vid' => $vid,
            'name' => $name,
            'weight' => 50,
              ]);
          $term->save();
          $message = "Term saved.";
        }
        $result = array('vid' => $vid, 'tid' => $term->id(), 'name' => $name, 'message' => $message);
      }
      return new JsonResponse($result);
    }

    public static function set_cc_edit_term() {
      $vid = $_POST['vid'];
      $tid = $_POST['tid'];
      $name = $_POST['name'];
      if(isset($tid) && !empty($tid) && isset($name) && !empty($name)){
        $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
        $term->name->setValue($name);
        $term->save(); // Important!!!!

        $result = array('vid' => $vid, 'tid' => $tid, 'name' => $name, 'message' => 'Term saved');
      }
      return new JsonResponse($result);

    }

    public static function set_cc_delete_term() {
      $tid = $_POST['tid'];
      $vid = $_POST['vid'];
      if(isset($tid) && !empty($tid)){
        $term = Term::load($tid);
        $message = "No term found";
        if($term) {
          $term->delete();

          $message = "Term deleted.";
        }
        $result = array('tid' => $tid, 'vid' => $vid, 'message' => $message);
      }
      return new JsonResponse($result);
    }

    public static function set_cc_order_term() {
      $vid = $_POST['vid'];
      $sortOrder = $_POST['sortOrder'];
      foreach ($sortOrder as $key => $tid) {
        $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
        $term->weight->setValue($key);
        $term->save(); // Important!!!!
      }
      $result = array('message' => 'sortOrderSaved');
      return new JsonResponse($result);
    }

    public static function set_cc_add_taxonomy() {
      $name = $_POST['name'];
      $name = substr(strtolower($name),0,2) == 'cc' ? $name : 'CC '.$name;
      $vid =  strtolower(str_replace(' ', '_', preg_replace('/[^A-Za-z0-9 \-]/', '', trim($name, " \t."))));

      $vocabularies = Vocabulary::loadMultiple();
      if (!isset($vocabularies[$vid])) {
          $vocabulary = Vocabulary::create(array(
              'vid' => $vid,
              //'machine_name' => $vid,
              'weight' => '50',
              'description' => '',
              'name' => $name,
        ));
        $vocabulary->save();
      }
      $result = array('message' => 'Vocabulary Saved.','vid' => $vid,'v_name' => str_replace('CC ', '', $name));
      return new JsonResponse($result);
    }

    public static function set_cc_edit_taxonomy() {
      $vid = $_POST['vid'];
      $name = $_POST['name'];
      $name = substr(strtolower($name),0,2) == 'cc' ? $name : 'CC '.$name;
      $vocabularies = Vocabulary::loadMultiple();
      if (isset($vocabularies[$vid])) {
        // Vocabulary Already exist
        $vocab = Vocabulary::load($vid);
        $vocab->set('name', $name);
        $vocab->save(); // Important!!!!
      }
      $result = array('message' => 'Vocabulaty Edited.','vid' => $vid,'v_name' => str_replace('CC ', '', $name));
      return new JsonResponse($result);
    }

    public static function set_cc_delete_taxonomy() {
      $vid = $_POST['vid'];

      $vocab = Vocabulary::load($vid);
      if ($vocab) {
          $vocab->delete();
      }

      $result = array('message' => 'Done','vid' => $vid);
      return new JsonResponse($result);
    }

    public static function set_cc_order_taxonomy() {
      $sortOrder = $_POST['sortOrder'];
      foreach ($sortOrder as $key => $vid) {
        $vocab = Vocabulary::load($vid);
        $vocab->set('weight', $key-40);
        $vocab->save(); // Important!!!!

        $result = array('message' => 'Vocabulaty Order Saved.','vid' => $vid,'v_name' => $sortOrder);

      }
      $result = array('message' => 'sortOrderSaved');
      return new JsonResponse($result);
    }
}
