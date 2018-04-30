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

class ViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate
{
    //MARK: (special comment, aka where you list properties)
    
    @IBOutlet weak var geofenceMapLabel: UILabel!
    @IBOutlet weak var mapView: MKMapView!
    @IBOutlet weak var SummaryButton: UIButton!
    
    let locationManager = CLLocationManager()
    var enterRegionTime = Date()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //instance of location manager detects users location changes
        locationManager.delegate = self
        locationManager.distanceFilter = kCLLocationAccuracyNearestTenMeters
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        
        mapView.delegate = self
        mapView.showsUserLocation = true
        mapView.userTrackingMode = .follow
        
        SummaryButton.layer.borderWidth = 2
        SummaryButton.layer.borderColor = UIColor.blue.cgColor
        
        setupData()

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
        
        if #available(iOS 11.0, *) {
            let scale = MKScaleView(mapView: mapView)
            scale.scaleVisibility = .visible // always visible
            view.addSubview(scale)
        } else {
            // Fallback on earlier versions
        }
       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func setupData(){
        //1. check if system can monitor regions
        if CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self){
            
            //print("setupData called")
            
            //2. region data
            let title = "Mudd Library"
            let coordinate = CLLocationCoordinate2DMake(42.058508,-87.674386)
            let regionRadius = 50.0
            
            //3. setup region
            let region = CLCircularRegion(center: CLLocationCoordinate2D(latitude: coordinate.latitude, longitude: coordinate.longitude), radius: regionRadius, identifier: title)
            locationManager.startMonitoring(for: region)
            
            //4. setup annotation
            let muddLibraryAnnotation = MKPointAnnotation()
            muddLibraryAnnotation.coordinate = coordinate;
            muddLibraryAnnotation.title = "\(title)";
            mapView.addAnnotation(muddLibraryAnnotation)
            
            //5. setup circle
            let circle = MKCircle(center: coordinate, radius: regionRadius)
            mapView.add(circle)
        }
        else{
            print("system can't track regions")
        }
    }
    
    func mapView(_ mapView: MKMapView, rendererFor overlay:MKOverlay) -> MKOverlayRenderer{
        let circleRenderer = MKCircleRenderer(overlay: overlay)
        circleRenderer.strokeColor = UIColor.red
        circleRenderer.lineWidth = 1.0
        return circleRenderer
    }
    
    //Tracking regions
    //1. user enters regions
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion){
        //get current date +  time
        enterRegionTime = Date()
        //startTimer = NSDate()
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = TimeZone.current
        dateFormatter.dateFormat = "yyy-MM-dd HH:mm"
        let dateCurrent = dateFormatter.string(from: enterRegionTime)
        print("entered region at \(dateCurrent)")
        // show alert
        let enterAlert = UIAlertController(title: "Alert", message: "enter \(region.identifier)", preferredStyle: UIAlertControllerStyle.alert)
        enterAlert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
        self.present(enterAlert, animated: true, completion: nil)
        locationManager.startMonitoring(for: region)
    }
    //2. user exits region
    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion){
        //get current date + time
        let exitRegionTime = Date()
        let dateFormatter2 = DateFormatter()
        dateFormatter2.timeZone = TimeZone.current
        dateFormatter2.dateFormat = "yyy-MM-dd HH:mm"
        let dateCurrent = dateFormatter2.string(from: exitRegionTime)
        print("exited region at \(dateCurrent)")
        
        //calculate total time in region
        if #available(iOS 10.0, *) {
            let totalRegionTime = DateInterval(start: enterRegionTime, end: exitRegionTime).duration
            let totalTimeString = secondsToHoursMinutesSeconds(seconds: Int(totalRegionTime))
            print("Total time in region: \(totalTimeString)")
        } else {
            // Fallback on earlier versions
        }

        
        // show alert
        let exitAlert = UIAlertController(title: "Alert", message: "exit \(region.identifier)", preferredStyle: UIAlertControllerStyle.alert)
        exitAlert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: nil))
        self.present(exitAlert, animated: true, completion: nil)
    }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("didFailWithError")
    }
    func locationManagerDidPauseLocationUpdates(_ manager: CLLocationManager) {
        print("DidPauseLocationUpdates")
    }
    
    func secondsToHoursMinutesSeconds(seconds: Int) -> (String){
        let hrs = seconds/3600
        let mins = (seconds % 3600) / 60
        let secs = (seconds % 3600) % 60
        return "\(hrs) hours, \(mins) minutes, \(secs) seconds"
    }
    
}

