//
//  ViewController.swift
//  metacognitive-bt
//
//  Created by Allison on 1/20/18.
//  Copyright © 2018 DTR. All rights reserved.
//

import UIKit
import MapKit
import CoreLocation

class ViewController: UIViewController, MKMapViewDelegate
{
    //MARK: (special comment, aka where you list properties)
    
    @IBOutlet weak var geofenceMapLabel: UILabel!
    @IBOutlet weak var geofenceMap: MKMapView!
    
    let locationManager = CLLocationManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //instance of location manager detects users location changes
        locationManager.delegate = self as? CLLocationManagerDelegate
        locationManager.distanceFilter = kCLLocationAccuracyNearestTenMeters
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        
        geofenceMap.delegate = self;
        geofenceMap.showsUserLocation = true;
        geofenceMap.userTrackingMode = .follow
        
        setupData()
        
//        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
//        label.text = "Hello World"
//        view.addSubview(label)
//        label.text = "this is some text"
        
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        //1. status is not determined
        if CLLocationManager.authorizationStatus() == .notDetermined{
            locationManager.requestAlwaysAuthorization()
        }
        //2. authorization was denied
        else if CLLocationManager.authorizationStatus() == .denied{
            let alert = UIAlertController(title: "Alert", message: "Location services were denied, please enable location services for this app in Settings", preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
        //3. we do have authorization
        else if CLLocationManager.authorizationStatus() == .authorizedAlways{
            locationManager.startUpdatingLocation()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func setupData(){
        //1. check if system can monitor regions
        if CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self){
            
            //2. region data
            let title = "Mudd Library"
            let coordinate = CLLocationCoordinate2DMake(42.058508,-87.674386)
            let regionRadius = 300.0
            
            //3. setup region
            let region = CLCircularRegion(center: CLLocationCoordinate2D(latitude: coordinate.latitude, longitude: coordinate.longitude), radius: regionRadius, identifier: title)
            locationManager.startMonitoring(for: region)
            
            //4. setup annotation
            let muddLibraryAnnotation = MKPointAnnotation()
            muddLibraryAnnotation.coordinate = coordinate;
            muddLibraryAnnotation.title = "\(title)";
            geofenceMap.addAnnotation(muddLibraryAnnotation)
            
            //5. setup circle
            let circle = MKCircle(center: coordinate, radius: regionRadius)
            geofenceMap.add(circle)
        }
        else{
            print("system can't track regions")
        }
    }
    
    func geofenceMap(geofenceMap: MKMapView, rendererFor overlay:MKOverlay) -> MKOverlayRenderer{
        let circleRenderer = MKCircleRenderer(overlay: overlay)
        circleRenderer.strokeColor = UIColor.red
        circleRenderer.lineWidth = 1.0
        return circleRenderer
    }
    
    //Tracking regions
    //1. user enters regions
    func locationManager(manager: CLLocationManager, didEnterRegion region: CLRegion){
        let enterAlert = UIAlertController(title: "Alert", message: "enter \(region.identifier)", preferredStyle: UIAlertControllerStyle.alert)
        enterAlert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
        self.present(enterAlert, animated: true, completion: nil)
    }
    //2. user exits region
    func locationManager(manager: CLLocationManager, didExitRegion region: CLRegion){
        let exitAlert = UIAlertController(title: "Alert", message: "exit \(region.identifier)", preferredStyle: UIAlertControllerStyle.alert)
        exitAlert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
        self.present(exitAlert, animated: true, completion: nil)
    }
    
}

